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
    sin = Math.sin,
    cos = Math.cos,
    asin = Math.asin,
    atan2 = Math.atan2,
    solar = {};

//
// Calcs the Sun's true longitude and true anomaly
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
solar.calcTrueLonAndTrueAnomaly = function (s) {

    //
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.2)
    function calcMeanLon(T) {
        return base.horner(T, [280.46646, 36000.76983, 0.0003032]);
    }

    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 183 (28.2)
    function calcMeanLonVSOP87(T) {
        T = T /10;
        return base.horner(T,
            [280.4664567, 360007.6982779, 0.03032028, 1/49931, - 1/15300, -1/2000000]);
    }

    //
    // The mean anomaly is the angular difference
    // between a mean circular orbit and the true elliptic orbit.
    //
    // @param {T} Number - number of Julian centuries since J2000.
    // @result Number - radians and is not normalized to the range 0..2π.
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
    function calcMeanAnomaly(T) {
        return base.horner(T, [357.52911, 35999.05029, -0.0001537]);
    }
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144
    function calcMeanAnomalyEx(T) {
        return base.horner(T, [357.52772, 35999.050340, -0.0001603, -1/300000]);
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

    s.L0 = base.pmod(calcMeanLon(s.T), 360);
//  s.L1 = base.pmod(calcMeanLonEx(s.T), 360);

    s.M = base.pmod(calcMeanAnomaly(s.T), 360);
//  s.M1 = base.pmod(calcMeanAnomalyEx(s.T), 360);

    s.C = calcEquationOfCenter(s.T, s.M);

    s.dotO = s.L0 + s.C;
    s.v = s.M + s.C;

    return s;

};

////////////////////////////////////////////////////////////////////////////////

//
// The distance from a planet (here is the Earth) to the Sun, expressed in AU.
// AU (Astronomical Unit) is the mean distance of the Earth from the Sun,
// about 150 millions Kms.
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164 (25.5)
solar.calcRadiusVector = function (s) {

    var nom,
        denom;

    // Eccentricity of the orbit of the Earth around the Sun
    //
    // The eccentricity is the ratio between the semi-major axis and the
    // difference between the semi-major and semi-minor axis of the elliptic
    // orbit of the Earth around the Sun.
    //
    // @param {T} Number -
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.4)
    function calcEccentricity(T) {
        return base.horner(T, [0.016708634, 0.000042037, 0.0000001267]);
    }

    s.e = calcEccentricity(s.T);

    nom = 1.000001018 * (1 - (s.e * s.e));
    denom = 1 + s.e * cos(s.v * base.DEG2RAD);

    s.R = nom / denom;

    return s;

};

////////////////////////////////////////////////////////////////////////////////

//
// Apperant longitude of Sun
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
//
solar.calcAppLon = function(s) {

    // Longitude of the Moon's ascending node
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144/164
    s.Omega = base.horner(s.T,
        [125.04452, -1934.136261, 0.0020708, 1.0 / 450000.0]);

    s.lambda = s.dotO - 0.00569 - 0.00478 * sin(s.Omega * base.DEG2RAD);

    return s;

};

//
// mean obliquity of the ecliptic.
//
// "The adjective 'mean' indicates that the correction for nutation is NOT
//  taken into account!"
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//
solar.calcMeanObliquity = function(s) {

    // NOTE : formular uses/needs Seconds
    //
    //  23° 26' 21''.448 in arcsec's
    //  = 23 * 3600'' + 26 * 60'' + 21.448''
    //  = 82800'' + 1560'' + 21.448''
    //  = 84381.448
    s.epsilon0 = base.horner(s.T,
        [84381.448, -46.8150, -0.00059, 0.001813]) / 3600;

    // calculates the correction of mean obliquity of the ecliptic
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
    s.epsilon = s.epsilon0 + 0.00256 * cos(s.Omega * base.DEG2RAD);

    return s;

};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.6,7)
solar.calcAppPosition = function(s) {

    //  (4)
    var lambda = s.lambda * base.DEG2RAD,
        epsilon = s.epsilon * base.DEG2RAD,
        alpha = atan2(cos(epsilon) * sin(lambda), cos(lambda)),
        delta = asin(sin(epsilon) * sin(lambda));

    s.alpha = base.pmod(alpha * base.RAD2DEG, 360.0);
    s.delta = delta * base.RAD2DEG;

    return s;

};

module.exports = solar;