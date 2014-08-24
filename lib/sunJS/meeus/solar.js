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
    nutation = require('./nutationHigherAcc.js'),

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

    //
    //
    //
    function calcMeanLon(T) {

        //  VSOP87 ch. 32
         var L0 = base.horner(T / 10,
           [280.4664567, 360007.6982779, 0.03032028, 1/49931, - 1/15300, -1/2000000]);

        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
        // var L0 = base.horner(T, [280.46646, 36000.76983, 0.0003032]);

        return base.pmod(L0, 360);
    }

    // The mean anomaly is the angular difference
    // between a mean circular orbit and the true elliptic orbit.
    //
    function calcMeanAnomalySun (T) {

        // MEEUS, Astronomical Algorithms (Second Edition), p. 144
         var M = base.horner(T, [357.52772, 35999.050340, -0.0001603, -1/300000]);

        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
        // var M = base.horner(T, [357.52911, 35999.05029, -0.0001537]);

        return base.pmod(M, 360);
    }

    // Equation of the center
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
    function calcEquationOfCenter(T, M) {
        M *= base.DEG2RAD;
        return base.horner(T, [1.914602, -0.004817, -0.000014]) * sin(M)
            + (0.019993 - T * 0.000101) * sin(2 * M)
            + 0.000289 * sin(3 * M);
    }

    var L0 = calcMeanLon(T),
        M = calcMeanAnomalySun(T),
        C = calcEquationOfCenter(T, M);

    return L0 + C;

};

//
// @param
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.6,7)
solar.calcAppPosition = function(T, dotO, ε0) {

    var Omega = nutation.calcOmega(T) * base.DEG2RAD,

        // Apperant longitude of Sun
        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
        lambda = (dotO - 0.00569 - 0.00478 * sin(Omega)) * base.DEG2RAD,
        epsilon = (ε0 + 0.00256 * cos(Omega)) * base.DEG2RAD,

        alpha = atan2(cos(epsilon) * sin(lambda), cos(lambda)),
        delta = asin(sin(epsilon) * sin(lambda));

    return {
        alpha : base.pmod(alpha * base.RAD2DEG, 360.0),
        delta : delta * base.RAD2DEG
    };

};

module.exports = solar;
