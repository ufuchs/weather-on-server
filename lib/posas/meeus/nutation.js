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


nutation.calcApproxNutation = function (T) {
    var Omega = (125.04452 - 1934.136261 * T) * base.DEG2RAD,
        L = (280.4665 + 36000.7698 * T) * base.DEG2RAD,
        N = (218.3165 + 481267.8813 * T) * base.DEG2RAD;

    return {
        Δψ : (-17.2*sin(Omega) - 1.32*sin(2*L) - 0.23*sin(2*N) + 0.21*sin(2*Omega)) / 3600 * base.DEG2RAD,
        Δε : (9.2*cos(Omega) + 0.57*cos(2*L) + 0.1*cos(2*N) - 0.09*cos(2*Omega)) / 3600 * base.DEG2RAD
    }

}
/*
// ApproxNutation returns a fast approximation of nutation in longitude (Δψ)
// and nutation in obliquity (Δε) for a given JDE.
//
// Accuracy is 0.5″ in Δψ, 0.1″ in Δε.
//
// Result units are radians.
func ApproxNutation(jde float64) (Δψ, Δε float64) {
    T := (jde - base.J2000) / 36525
    Ω := (125.04452 - 1934.136261*T) * math.Pi / 180
    L := (280.4665 + 36000.7698*T) * math.Pi / 180
    N := (218.3165 + 481267.8813*T) * math.Pi / 180
    sΩ, cΩ := math.Sincos(Ω)
    s2L, c2L := math.Sincos(2 * L)
    s2N, c2N := math.Sincos(2 * N)
    s2Ω, c2Ω := math.Sincos(2 * Ω)
    Δψ = (-17.2*sΩ - 1.32*s2L - 0.23*s2N + 0.21*s2Ω) / 3600 * (math.Pi / 180)
    Δε = (9.2*cΩ + 0.57*c2L + 0.1*c2N - 0.09*c2Ω) / 3600 * (math.Pi / 180)
    return
}
*/


module.exports = nutation;
