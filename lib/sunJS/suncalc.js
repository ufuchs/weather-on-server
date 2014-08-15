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
    nutation = require('./meeus/nutation.js'),
    rise = require('./meeus/rise.js'),
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
//
//
var processSingleDay = function(jd, ε) {

    var T = julian.j2000Century(jd),
        dot0 = solar.calcTrueLonAndTrueAnomaly(T);

    return solar.calcAppPosition(T, dot0, ε);

    // var T = julian.j2000Century(jd);

    // return Q.when(solar.calcTrueLonAndTrueAnomaly(T))
    //     .then(function (dotO) {
    //         return solar.calcAppPosition(T, dot0, ε);
    //     }).
    //     done();

};

//
//
//
var processThreeDays = function(jd, ε) {

    var jd0 = julian.jdAtMidnight(jd),
        appPositions = [jd0 - 1, jd0, jd0 + 1].map(function (day) {
            return processSingleDay(day, ε);
        });

    return {
        alpha : appPositions.map(function (ap) { return ap.alpha; }),
        delta : appPositions.map(function (ap) { return ap.delta; })
    };

};

////////////////////////////////////////////////////////////////////////////////

SunCalc.getTimes = function (date, lat, lon) {

    console.log(date.toString());

    var d = julian.localTime2TimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        deltaT = deltat.poly2005to2050Nasa(d[0]) / 86400,
        alphaDelta,

        p = {

            phi : lat,
            L : lon * -1.0,
            tzo : date.getTimezoneOffset() / -1440,

            h0 : -0.833,        // 'standard' altitude of the center of the body

            jd : jd,
            deltaT : deltaT

        };

////////////////////////////////////////////////////////////////////////////////

    p.n = nutation.calc(julian.j2000Century(julian.jdAtMidnight(jd)));


////////////////////////////////////////////////////////////////////////////////

    alphaDelta = processThreeDays(p.jd, p.n.ε);

    p.gast0 = (sidereal.calcGmst0(p.jd) + (p.n.ra / 86400)) * 360.0;

    p.gmst = sidereal.calcGmst(p.jd) * 360;


    p.alpha = alphaDelta.alpha;
    p.delta = alphaDelta.delta;

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
