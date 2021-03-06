/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * suncalc
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Whenever you find yourself on the side of the majority, it is time to ]
 * [ pause and reflect.                                     - Oscar Wilde -]
 *
 */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    interpol = require('./meeus/interpol.js'),
    solar = require('./meeus/solar.js'),
    deltat = require('./meeus/deltat.js'),
    nutation = require('./meeus/nutationHigherAcc.js'),
    rise = require('./meeus/rise.js'),
    Q = require('q'),
    start = new Date(),
    finish,

    floor = Math.floor,
    round = Math.round;

//
//
//
(function () {

    "use strict";

var SunCalc = {};

// returns a sequence of Julian Day numbers depending on 'numOfDays'
// [jd-2, jd-1, jd, jd+1 .. jd+numOfDays-1, jd+numOfDays]
//  yesterday |                           | interpol last day
//
function getSequenceOfJulianDays(jd, numOfDays) {

    var jd0 = julian.jdAtMidnight(jd),
        i = -2,         // for daylength difference we need minus two extra days
        sequence = [];

    numOfDays += 1;     // for interpolation we need plus one extra day

    for (i; i < numOfDays; i += 1) {
        sequence.push(jd0 + i);
    }

    return sequence;

}

SunCalc.dayOfEquinox = 23;

//
//
//
SunCalc.getTimes = function (date, lat, lon) {

//    console.log(date.toString(), lat, lon);

    var d = julian.localTime2TimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        c = {
            phi : lat,
            L : lon * -1.0,
            h0 : -0.833,        // 'standard' altitude of the center of the body
            deltaT : deltat.poly2005to2050Nasa(d[0])     // in seconds
        };

    var seqLength = 4;

    return Q.when(getSequenceOfJulianDays(jd, seqLength))  // <-- returns 0h UT
        .then(function (seq) {
            return seq.map(function(jd) {
                return {
                    jd : jd,
                    nutation : nutation.calc(jd, c.deltaT)
                };
            });
        }).then(function(days) {
            // calcs for every JD the rigth ascension and declination
            return days.map(function (day) {
                var appPos = solar.calcAppRaAndDeclSync(day.jd, day.nutation);
                appPos.gast0 = sidereal.calcGast0(day.jd, day.nutation) * 360.0;
                appPos.jd = day.jd;
                return appPos;
            });
        }).then(function(appPos) {
            // separate each value in an own array
            return {
                jd    : appPos.map(function (ap) { return ap.jd; }),
                gast0 : appPos.map(function (ap) { return ap.gast0; }),
                radVec : appPos.map(function (ap) { return ap.radVec; }),
                alpha : appPos.map(function (ap) { return ap.alpha; }),
                delta : appPos.map(function (ap) { return ap.delta; })
            };
        }).then(function(jad) {
            // preparing the final calculation.
            // This means, partitioning into values for strict one day
            var begin,
                end,
                jd,
                date,
                gast0,
                res = [];

            for (begin = 0; begin < seqLength + 1; begin += 1) {

                end = begin + 3;

                jd = jad.jd.slice(begin, end);

                gast0 = jad.gast0.slice(begin, end);

                res.push({
                    date : julian.jdToCalendarGregorian(jd[1]),
                    jd : jd[1],
                    gast0 : gast0[1],
                    radVec : jad.radVec.slice(begin, end),
                    alpha : jad.alpha.slice(begin, end),
                    delta : jad.delta.slice(begin, end)
                });

            }

            return res;

        }).then(function(days) {

            var sun,
                tzOff,
                daylength,
                yesterdaysDayLength = 0,
                dayLengthDiff;

            return days.map(function (day) {

                sun = rise.process(c, day);

                tzOff = new Date(day.date[0], day.date[1] - 1, day.date[2], 4, 0, 0).getTimezoneOffset() * 60;

                daylength = sun.set - sun.rise;

                dayLengthDiff = daylength - yesterdaysDayLength;

                yesterdaysDayLength = daylength;

                return {
                    date : day.date,
                    jd : day.jd,
                    tzOff :  tzOff,
                    rise : round(sun.rise * 86400 - tzOff),
                    transit : round(sun.transit * 86400 - tzOff),
                    set : round(sun.set * 86400 - tzOff),
                    dayLength : round(daylength * 86400),
                    dayLengthDiff : round(dayLengthDiff * 86400),
                    minMaxDelta : {
                        daysBefore : undefined,
                        value : interpol.extremum(day.delta)
                    },
                    zeroDelta : {
                        daysBefore : undefined,
                        value : interpol.zero(day.delta)
                    },
                    minMaxMRadVec : {
                        daysBefore : undefined,
                        value : interpol.extremum(day.radVec)
                    }
                };

            });

        }).then(function (days) {

            return days.slice(1);   // Remove yesterday. It was once and only
                                    // needed to calculate the day length
                                    // difference.

        }).then(function(days) {

            ////
            // enumerate the days befora a vernal or autumn equinox will happen
            ////

            function enumDaysBeforeEquinox (days) {

                var zeroDelta,
                    wasZero = false,
                    daysBefore = 1,
                    upsideDown,
                    month = days[0].date[1],
                    day = days[0].date[2],

                    equinoxThreshold = (((month === 9) || (month === 3)) && (day >= 15) && (day <= 24));

                if (!equinoxThreshold) {
                    return days;
                }

                upsideDown = days.reverse().map(function (day) {

                    zeroDelta = day.zeroDelta;

                    if ((zeroDelta.value === undefined) && (wasZero) && (daysBefore < 4)) {
                        zeroDelta.daysBefore = daysBefore++;
                    } else {
                        wasZero = zeroDelta.value !== undefined;
                    }

                    return day;

                });

                return upsideDown.reverse();

            }

            return enumDaysBeforeEquinox(days);

        }).then(function(days) {

            ////
            // enumerate the days befora a summer or winter solstice will happen
            ////

            function enumDaysBeforeSolstice(days) {

                var extremumDelta,
                    wasExtremum = false,
                    daysBefore = 1,
                    upsideDown,
                    month = days[0].date[1],
                    day = days[0].date[2],

                    solsticeThreshold = (((month === 6) || (month === 12)) && (day >= 15) && (day <= 24));

                if (!solsticeThreshold) {
                    return days;
                }

                upsideDown = days.reverse().map(function (day) {

                    extremumDelta = day.minMaxDelta;

                    if ((extremumDelta.value === undefined) && (wasExtremum) && (daysBefore < 4)) {
                        extremumDelta.daysBefore = daysBefore++;
                    } else {
                        wasExtremum = extremumDelta.value !== undefined;
                    }

                    return day;

                });

                return upsideDown.reverse();

            }

            return enumDaysBeforeSolstice(days);

        }).then(function(days) {

            ////
            // enumerate the days befora a perihelon or aphelon of the Earth will happen
            ////

            function enumDaysBeforeApsis(days) {

                var apsis,
                    wasApsis = false,
                    daysBefore = 1,
                    upsideDown,
                    month = days[0].date[1],
                    day = days[0].date[2],

                    apsisThreshold = (((month === 1) || (month === 7)) && (day >= 1) && (day <= 10));

                if (!apsisThreshold) {
                    return days;
                }

                upsideDown = days.reverse().map(function (day) {

                    apsis = day.minMaxMRadVec;

                    if ((apsis.value === undefined) && (wasApsis) && (daysBefore < 4)) {
                        apsis.daysBefore = daysBefore++;
                    } else {
                        wasApsis = apsis.value !== undefined;
                    }

                    return day;

                });

                return upsideDown.reverse();

            }

            return enumDaysBeforeApsis(days);

        }).fail(function(err) {
            console.log(err);
        });

};

    // export as AMD module / Node module / browser variable

    if (typeof define === 'function' && define.amd) {
        define(SunCalc);
    } else if (typeof module !== 'undefined') {
        module.exports = SunCalc;
    } else {
        window.SunCalc = SunCalc;
    }

}());

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
