/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * sidereal
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Man loves company - even if it is only that of a small burning candle. ]
 * [                                               - Georg C. Lichtenberg - ]
 */

'use strict';

var base = require('../base/base.js'),
    solar = {};

//
// True longitude of the Sun
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
solar.calcTrueLonAndTrueAnomaly = function (s) {

    //
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.2)
    function calcMeanLon(T) {
        return base.horner(T, [280.46646, 36000.76983, 0.0003032]) * base.DEG2RAD;
    }

    //
    // The mean anomaly is the angular difference
    // between a mean circular orbit and the true elliptic orbit.
    //
    // @param {T} Number - number of Julian centuries since J2000.
    // @result Number - radians and is not normalized to the range 0..2π.
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
    function calcMeanAnomaly(T) {
        // @see : p. 144, a more extensive formular
        return base.Horner(T, [357.52911, 35999.05029, -0.0001537]) * base.DEG2RAD;
    }

    //
    // Equation of the center
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
    function calcEquationOfCenter(T, M) {

        var C = base.Horner(T, [1.914602, -0.004817, -0.000014]) * Math.sin(M)
            + (0.019993 - T * 0.000101) * Math.sin(2 * M)
            + 0.000289 * Math.sin(3 * M);

        return C *= base.DEG2RAD;

    }

    s.L0 = calcMeanLon(s.T);
    s.M = calcMeanAnomaly(s.T);
    s.C = calcEquationOfCenter(s.T, s.M);

    s.⨀ = s.L0 + s.C;
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
    function calcEccentricity (T) {
        return base.horner(s.T, [0.016708634, 0.000042037, 0.0000001267]);
    }

    s.e = calcEccentricity(s.T);

    nom = 1.000001018 * (1 - (s.e * s.e));

    denom = 1 + s.e * Math.cos(s.v * base.DEG2RAD);

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


    //
    // Longitude of the Moon's ascending node
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
    //
    function calcOmega (s) {
        return base.horner(s.T, [125.04452, 1934.136261, 0.0020708, 1.0 / 450000.0]);
    }

    s.Ω = calcOmega(s.T);

    s.λ = s.⨀ - 0.00569 - 0.00478 * Math.sin(s.Ω * base.DEG2RAD);

    return s;

};

//
// mean obliquity of the ecliptic.
//
// "The adjective 'mean' indicates that the correction for nutation is NOT taken into account!"
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//
solar.calcMeanObliquity = function(s) {

    //  23° 26' 21''.448 in arcsec's
    //  = 23 * 3600'' + 26 * 60'' + 21.448''
    //  = 82800'' + 1560'' + 21.448''
    //  = 84381.448
    s.ε0 = base.horner(s.T, [84381.448, 46.8150, 0.00059, 0.001813]) / 3600.0;

    return s;

};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
solar.calcCorrObliquity = function(s) {

    s.corrObli = s.ε0 + 0.00256 * Math.cos(s.Ω * base.DEG2RAD);

    return s;

};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.6,7)
solar.calcRightAscensionAndDeclination = function(s) {

    //  (4)
    var sinAppLon = Math.sin(s.λ * base.DEG2RAD),

        radCorrObli = s.corrObli * base.DEG2RAD,

        rigthAsc = Math.atan2((Math.cos(radCorrObli) * sinAppLon),
            Math.cos(s.λ * base.DEG2RAD));

    s.ra = base.pmod(rigthAsc  * base.RAD2DEG, 360.0);

    //  (5)
    s.decl = Math.asin(Math.sin(radCorrObli) * sinAppLon) * base.RAD2DEG;

    return s;

};

module.exports = solar;
