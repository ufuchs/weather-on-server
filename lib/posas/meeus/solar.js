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

    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 183 (28.2)
    function calcMeanLon(T) {
        var L0 = base.horner(T / 10,
            [280.4664567, 360007.6982779, 0.03032028, 1/49931, - 1/15300, -1/2000000]);
        return base.pmod(L0, 360);
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

    s.L0 = calcMeanLon(s.T);
    s.M = nutation.calcMeanAnomalySun(s.T);
    s.C = calcEquationOfCenter(s.T, s.M);

    s.dotO = s.L0 + s.C;
    s.v = s.M + s.C;

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

    var n = nutation.calc(s.T);

    // calculates the correction of mean obliquity of the ecliptic
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
    s.epsilon0 = nutation.calcMeanObliquityLaskar(s.T);

    s.epsilon = s.epsilon0 + n.Δε;
    s.n = n;

    return s;

};

//
// Apperant longitude of Sun
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 164
//
solar.calcAppLon = function(s) {

    s.Omega = nutation.calcOmega(s.T);

    s.lambda = s.dotO - 0.00569 - 0.00478 * sin(s.Omega * base.DEG2RAD);

    return s;

};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.6,7)
solar.calcAppPosition = function(s) {

    //  (4)
    var lambda = s.lambda * base.DEG2RAD,
        epsilon = s.epsilon + 0.00256 * cos(s.Omega * base.DEG2RAD),
        alpha = atan2(cos(epsilon * base.DEG2RAD) * sin(lambda), cos(lambda)),
        delta = asin(sin(epsilon * base.DEG2RAD) * sin(lambda));

    s.alpha = base.pmod(alpha * base.RAD2DEG, 360.0);
    s.delta = delta * base.RAD2DEG;

    return s;

};

solar.equationOfTime = function (p) {

    p.E = p.L0 - 0.0057183 - p.alpha + p.n.Δψ * cos(p.epsilon0);

    p.E = julian.dec2hhmmss((p.E / 360));

    return p

}

//
//
//
solar.processSingleDay = function(jd) {

    var p = {};

    p.T = julian.j2000Century(jd);

    p = solar.calcTrueLonAndTrueAnomaly(p);
    p = solar.calcMeanObliquity(p);
    p = solar.calcAppLon(p);
    p = solar.calcAppPosition(p);
    p = solar.equationOfTime(p);

//    console.log(p);

    return [p.alpha, p.delta];

};

//
//
//
solar.process = function(jd) {

    var jd0 = julian.jdAtMidnight(jd),
        alphaDelta = [jd0 - 1, jd0, jd0 + 1].map(function (day) {
            return solar.processSingleDay(day);
        });

    return {
        alpha : alphaDelta.map(function (ad) { return ad[0]; }),
        delta : alphaDelta.map(function (ad) { return ad[1]; })
    };

};

module.exports = solar;
