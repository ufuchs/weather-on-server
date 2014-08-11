/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * nutation
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ When everything seems to be going against you, remember that the airplane ]
 * [ takes off against the wind, not with it.                   - Henry Ford - ]
 *
 */

var base = require('./base.js'),
    sin = Math.sin,
    cos = Math.cos,
    nutation = {};

//
//
//
// nutation.calcMeanObliquity = function (T) {
//     // NOTE : formular uses/needs seconds
//     //
//     //  23° 26′ 21″.406 in arcsec's
//     //  = 23 * 3600'' + 26 * 60'' + 21.406''
//     //  = 82800'' + 1560'' + 21.406''
//     //  = 84381.406
//     // Astronomical Almanac for 2010 specifies:
//     // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
//     return base.horner(T,
//         [84381.406, -46.836769, -0.0001831, 0.00200340, -0.576e-6,-4.34e-8]) / 3600;
// };

//
// true obliquity of the ecliptic.
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//
nutation.calcTrueObliquity = function(s) {

    var n = nutation.calc(s.T);

    // calculates the correction of mean obliquity of the ecliptic
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
    // NOTE : formular uses/needs seconds
    //
    //  23° 26′ 21″.406 in arcsec's
    //  = 23 * 3600'' + 26 * 60'' + 21.406''
    //  = 82800'' + 1560'' + 21.406''
    //  = 84381.406
    // Astronomical Almanac for 2010 specifies:
    // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
    s.epsilon0 = base.horner(s.T,
        [84381.406, -46.836769, -0.0001831, 0.00200340, -0.576e-6,-4.34e-8]) / 3600;

    s.epsilon = s.epsilon0 + n.Δε;
    s.n = n;

    return s;

};

//
// The mean anomaly is the angular difference
// between a mean circular orbit and the true elliptic orbit.
//
// @param {T} Number - number of Julian centuries since J2000.
// @result Number - radians and is not normalized to the range 0..2π.
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 163 (25.3)
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144
nutation.calcMeanAnomalySun = function (T) {
    var M = base.horner(T, [357.52772, 35999.050340, -0.0001603, -1/300000]);
    return base.pmod(M, 360);
};

// Longitude of the Moon's ascending node
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144/164
nutation.calcOmega = function (T) {
    var Omega = base.horner(T, [125.04452, -1934.136261, 0.0020708, 1/450000.0]);
    return base.pmod(Omega, 360);
};

// ApproxNutation returns a fast approximation of nutation in longitude (Δψ)
// and nutation in obliquity (Δε) for a given JDE.
//
// Accuracy is 0.5″ in Δψ, 0.1″ in Δε.
//
nutation.calc = function (T) {

    !! hier weiter...

    //
    // true obliquity of the ecliptic.
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
    //
    calcTrueObliquity = function(s) {

        var n = nutation.calc(s.T);

        // calculates the correction of mean obliquity of the ecliptic
        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
        // NOTE : formular uses/needs seconds
        //
        //  23° 26′ 21″.406 in arcsec's
        //  = 23 * 3600'' + 26 * 60'' + 21.406''
        //  = 82800'' + 1560'' + 21.406''
        //  = 84381.406
        // Astronomical Almanac for 2010 specifies:
        // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
        s.epsilon0 = base.horner(s.T,
            [84381.406, -46.836769, -0.0001831, 0.00200340, -0.576e-6,-4.34e-8]) / 3600;

        s.epsilon = s.epsilon0 + n.Δε;
        s.n = n;

        return s;

    };


    var Omega = nutation.calcOmega(T), //base.pmod(125.04452 - 1934.136261 * T, 360) * base.DEG2RAD,
        L = (280.4665 + 36000.7698 * T) * base.DEG2RAD,
        N = (218.3165 + 481267.8813 * T) * base.DEG2RAD,
        Δψ = (-17.2*sin(Omega) - 1.32*sin(2*L) - 0.23*sin(2*N) + 0.21*sin(2*Omega)) / 3600,
        Δε = (9.2*cos(Omega) + 0.57*cos(2*L) + 0.1*cos(2*N) - 0.09*cos(2*Omega)) / 3600,
        // calculates the correction of mean obliquity of the ecliptic
        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165, (25.8)
        // NOTE : formular uses/needs seconds
        //
        //  23° 26′ 21″.406 in arcsec's
        //  = 23 * 3600'' + 26 * 60'' + 21.406''
        //  = 82800'' + 1560'' + 21.406''
        //  = 84381.406
        // Astronomical Almanac for 2010 specifies:
        // ε = 23° 26′ 21″.406 − 46″.836769 T − 0″.0001831 T2 + 0″.00200340 T3 − 0″.576×10−6 T4 − 4″.34×10−8 T5
        ε0 = base.horner(s.T,
            [84381.406, -46.836769, -0.0001831, 0.00200340, -0.576e-6,-4.34e-8]) / 3600;

    return {
        Δψ : Δψ,
        Δε : Δε,
        ra : (Δψ * 3600) *                  // n.Δψ in arcseconds
            cos((ε0 + Δε) * base.DEG2RAD) /   // cos of the true obliquity
            15                                  // correction in seconds of time

    };
};

// returns "nutation in right ascension"
//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 88, example 12a
nutation.calcNutationInRA = function (n, ε0) {

    return (n.Δψ * 3600) *                  // n.Δψ in arcseconds
        cos((ε0 + n.Δε) * base.DEG2RAD) /   // cos of the true obliquity
        15                                  // correction in seconds of time

}

module.exports = nutation;
