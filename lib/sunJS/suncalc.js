/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * suncalc
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 *   [ Whenever you find yourself on the side of the majority, it is time to ]
 *   [ pause and reflect.                                     - Oscar Wilde -]
 *
 */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    solar = require('./meeus/solar.js'),
    deltat = require('./meeus/deltat.js'),
    nutation = require('./meeus/nutationHigherAcc.js'),
    rise = require('./meeus/rise.js'),
    Q = require('q'),
    start = new Date(),
    finish;

//
//
//
(function () {

    "use strict";

var SunCalc = {};

////////////////////////////////////////////////////////////////////////////////

//
// prepareSequenceOfJulianDays
//
function getSequenceOfJulianDays(jd, numOfDays) {

    var jd0 = julian.jdAtMidnight(jd),
        i = -1,         // for interpolation we need minus one extra day
        sequence = [];

    numOfDays += 1;     // for interpolation we need plus one extra day

    for (i; i < numOfDays; i += 1) {
        sequence.push(jd0 + i);
    }

    return sequence;

}

// //
// //
// //
// var calcAppRaAndDeclSync = function(sequence, ΔT) {

//     var appPositions = sequence.map(function (jd0) {
//         return solar.calcAppRaAndDeclSync(jd0, ΔT);
//     });

//     return {
//         alpha : appPositions.map(function (ap) { return ap.alpha; }),
//         delta : appPositions.map(function (ap) { return ap.delta; })
//     };

// };

// //
// //
// //
// var calcAppRaAndDecl = function(sequence, ΔT) {

//     var appPositions = sequence.map(function (jd0) {
//         return solar.calcAppRaAndDeclSync(jd0, ΔT);
//     });

//     return {
//         alpha : appPositions.map(function (ap) { return ap.alpha; }),
//         delta : appPositions.map(function (ap) { return ap.delta; })
//     };

// };

////////////////////////////////////////////////////////////////////////////////

SunCalc.getTimes = function (date, lat, lon) {

    console.log(date.toString());

    var d = julian.localTime2TimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        deltaT = deltat.poly2005to2050Nasa(d[0]),
        alphaDelta,

        p = {

            phi : lat,
            L : lon * -1.0,
            tzo : date.getTimezoneOffset() / -1440,

            h0 : -0.833,        // 'standard' altitude of the center of the body

            jd : jd,
            deltaT : deltaT     // in seconds

        };

////////////////////////////////////////////////////////////////////////////////

//    p.n = nutation.calc(jd, p.deltaT);

////////////////////////////////////////////////////////////////////////////////

    Q.when(getSequenceOfJulianDays(jd, 4))
        .then(function (s) {
            return s.map(function(jd) {
                return [jd, nutation.calc(jd, p.deltaT)];
            });
        })
        .then(function(days) {

            var appPositions = days.map(function (day) {
                return solar.calcAppRaAndDeclSync.apply(this, day);
            });

            return {
                alpha : appPositions.map(function (ap) { return ap.alpha; }),
                delta : appPositions.map(function (ap) { return ap.delta; })
            };

        })
        .then(function(s) {
            var i;

            for (i = 0; i < 4 - 1; i += 1){
                var x = s.alpha.slice(i);
                console.log(x);
            }

        });


    /*
    alphaDelta = processThreeDays(p.jd, p.deltaT);

    p.alpha = alphaDelta.alpha;
    p.delta = alphaDelta.delta;

    p.gast0 = (sidereal.calcGmst0(p.jd) + (p.n.ra / 86400)) * 360.0;
//    p.gast0 = sidereal.calcGast0(p.jd, p.n) * 360.0;

    p.gmst = sidereal.calcGmst(p.jd) * 360;



////////////////////////////////////////////////////////////////////////////////

    p = rise.process(p);

//    console.log(p);

    var m = p.m;

    m[0] = m[0] + p.tzo;
    m[1] = m[1] + p.tzo;
    m[2] = (m[2] < m[1] ? m[2] + 1 : m[2]) + p.tzo;

    console.log(julian.dec2hhmmssA(m[0]));
    console.log(julian.dec2hhmmssA(m[1]));
    console.log(julian.dec2hhmmssA(m[2]));

    return {
        solarNoon: m[0] * 86400,
        sunrise : m[1] * 86400,
        sunset : m[2] * 86400
    };

    */

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
