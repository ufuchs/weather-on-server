/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * solar
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Man loves company - even if it is only that of a small burning candle. ]
 * [                                               - Georg C. Lichtenberg - ]
 */

'use strict';

var base = require('./base.js'),
    julian = require('./julian.js'),
    nutation = require('./nutation.js'),
    sidereal = require('./sidereal.js'),
    Q = require('q'),

    sin = Math.sin,
    cos = Math.cos,
    asin = Math.asin,
    atan2 = Math.atan2,
    solar = {};

//
// Calcs the Sun's true longitude and true anomaly
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
solar.calcTrueLonAndTrueAnomaly = function (T) {

    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 183 (28.2)
    function calcMeanLon(T) {
        var L0 = base.horner(T / 10,
            [280.4664567, 360007.6982779, 0.03032028, 1/49931, - 1/15300, -1/2000000]);
        return base.pmod(L0, 360);
    }

    // The mean anomaly is the angular difference
    // between a mean circular orbit and the true elliptic orbit.
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144
    function calcMeanAnomalySun (T) {
        var M = base.horner(T, [357.52772, 35999.050340, -0.0001603, -1/300000]);
        return base.pmod(M, 360);
    }

    //
    // Equation of the center
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
    function calcEquationOfCenter(T, M) {
        M *= base.DEG2RAD;
        return (base.horner(T, [1.914602, -0.004817, -0.000014]) * sin(M) +
            (0.019993 - T * 0.000101) * sin(2 * M) +
            0.000289 * sin(3 * M));
    }

    var L0 = calcMeanLon(T),
        M = calcMeanAnomalySun(T),
        C = calcEquationOfCenter(T, M);

    return L0 + C;

};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.6,7)
solar.calcAppPosition = function(T, dotO, ε) {

    var Omega = nutation.calcOmega(T) * base.DEG2RAD,

        // Apperant longitude of Sun
        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
        lambda = (dotO - 0.00569 - 0.00478 * sin(Omega)) * base.DEG2RAD,

        epsilon = ε * base.DEG2RAD,

        alpha = atan2(cos(epsilon) * sin(lambda), cos(lambda)),
        delta = asin(sin(epsilon) * sin(lambda));

    alpha = base.pmod(alpha * base.RAD2DEG, 360.0);
    delta = delta * base.RAD2DEG;

    return [alpha, delta];

};

//
//
//
solar.processSingleDay = function(jd, ε) {

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
solar.process = function(jd, ε) {

    var jd0 = julian.jdAtMidnight(jd),
        appPositions = [jd0 - 1, jd0, jd0 + 1].map(function (day) {
            return solar.processSingleDay(day, ε);
        });

    return {
        alpha : appPositions.map(function (ad) { return ad[0]; }),
        delta : appPositions.map(function (ad) { return ad[1]; })
    };

};

module.exports = solar;
