/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * rise
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
// mean obliquity of the ecliptic.
//
// "The adjective 'mean' indicates that the correction for nutation is NOT
//  taken into account!"
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//
nutation.calcMeanObliquity = function(T) {

    // NOTE : formular uses/needs Seconds
    //
    //  23° 26' 21''.448 in arcsec's
    //  = 23 * 3600'' + 26 * 60'' + 21.448''
    //  = 82800'' + 1560'' + 21.448''
    //  = 84381.448
    return base.horner(T,
        [84381.448, -46.8150, -0.00059, 0.001813]) / 3600;

};

// MeanObliquityLaskar returns mean obliquity (ε₀) following the Laskar
// 1986 polynomial.
//
// Accuracy over the range 1000 to 3000 years is .01″.
//
// Accuracy over the valid date range of -8000 to +12000 years is
// "a few seconds."
//
// Result unit is radians.
nutation.calcMeanObliquityLaskar = function (T) {
    // (22.3) p. 147
    return base.horner(T / 100, [84381.448, -4680.93, -1.55, 1999.25, -51.38, -249.67, -39.05, 7.12, 2787, 5.79, 2.45]) / 3600;
}

// ApproxNutation returns a fast approximation of nutation in longitude (Δψ)
// and nutation in obliquity (Δε) for a given JDE.
//
// Accuracy is 0.5″ in Δψ, 0.1″ in Δε.
//
nutation.calcApproxNutation = function (T) {
    var Omega = base.pmod(125.04452 - 1934.136261 * T, 360) * base.DEG2RAD,
        L = (280.4665 + 36000.7698 * T) * base.DEG2RAD,
        N = (218.3165 + 481267.8813 * T) * base.DEG2RAD;

    return {
        Δψ : (-17.2*sin(Omega) - 1.32*sin(2*L) - 0.23*sin(2*N) + 0.21*sin(2*Omega)) / 3600,
        Δε : (9.2*cos(Omega) + 0.57*cos(2*L) + 0.1*cos(2*N) - 0.09*cos(2*Omega)) / 3600
    }

};


// NutationInRA returns "nutation in right ascension" or "equation of the
// equinoxes."
//
// Result is an angle in radians.
nutation.calcNutationInRA = function (T) {
    var n = nutation.calcApproxNutation(T),
        ε0 = nutation.calcMeanObliquity(T),
        ε = ε0 + n.Δε;

    return (n.Δψ * 3600) * cos(ε * base.DEG2RAD) / 15;

}

module.exports = nutation;
