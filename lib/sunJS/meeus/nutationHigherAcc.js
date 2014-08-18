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
    julian = require('./julian.js'),

    sin = Math.sin,
    cos = Math.cos,
    nutation = {},

    TERMS = 63,

    args = [
    //   D      M       MM      F       O
        [0.0,   0.0,    0.0,    0.0,    1.0],
        [-2.0,  0.0,    0.0,    2.0,    2.0],
        [0.0,   0.0,    0.0,    2.0,    2.0],
        [0.0,   0.0,    0.0,    0.0,    2.0],
        [0.0,   1.0,    0.0,    0.0,    0.0],
        [0.0,   0.0,    1.0,    0.0,    0.0],
        [-2.0,  1.0,    0.0,    2.0,    2.0],
        [0.0,   0.0,    0.0,    2.0,    1.0],
        [0.0,   0.0,    1.0,    2.0,    2.0],
        [-2.0,  -1.0,   0.0,    2.0,    2.0],
        [-2.0,  0.0,    1.0,    0.0,    0.0],
        [-2.0,  0.0,    0.0,    2.0,    1.0],
        [0.0,   0.0,    -1.0,   2.0,    2.0],
        [2.0,   0.0,    0.0,    0.0,    0.0],
        [0.0,   0.0,    1.0,    0.0,    1.0],
        [2.0,   0.0,    -1.0,   2.0,    2.0],
        [0.0,   0.0,    -1.0,   0.0,    1.0],
        [0.0,   0.0,    1.0,    2.0,    1.0],
        [-2.0,  0.0,    2.0,    0.0,    0.0],
        [0.0,   0.0,    -2.0,   2.0,    1.0],
        [2.0,   0.0,    0.0,    2.0,    2.0],
        [0.0,   0.0,    2.0,    2.0,    2.0],
        [0.0,   0.0,    2.0,    0.0,    0.0],
        [-2.0,  0.0,    1.0,    2.0,    2.0],
        [0.0,   0.0,    0.0,    2.0,    0.0],
        [-2.0,  0.0,    0.0,    2.0,    0.0],
        [0.0,   0.0,    -1.0,   2.0,    1.0],
        [0.0,   2.0,    0.0,    0.0,    0.0],
        [2.0,   0.0,    -1.0,   0.0,    1.0],
        [-2.0,  2.0,    0.0,    2.0,    2.0],
        [0.0,   1.0,    0.0,    0.0,    1.0],
        [-2.0,  0.0,    1.0,    0.0,    1.0],
        [0.0,   -1.0,   0.0,    0.0,    1.0],
        [0.0,   0.0,    2.0,    -2.0,   0.0],
        [2.0,   0.0,    -1.0,   2.0,    1.0],
        [2.0,   0.0,    1.0,    2.0,    2.0],
        [0.0,   1.0,    0.0,    2.0,    2.0],
        [-2.0,  1.0,    1.0,    0.0,    0.0],
        [0.0,   -1.0,   0.0,    2.0,    2.0],
        [2.0,   0.0,    0.0,    2.0,    1.0],
        [2.0,   0.0,    1.0,    0.0,    0.0],
        [-2.0,  0.0,    2.0,    2.0,    2.0],
        [-2.0,  0.0,    1.0,    2.0,    1.0],
        [2.0,   0.0,    -2.0,   0.0,    1.0],
        [2.0,   0.0,    0.0,    0.0,    1.0],
        [0.0,   -1.0,   1.0,    0.0,    0.0],
        [-2.0,  -1.0,   0.0,    2.0,    1.0],
        [-2.0,  0.0,    0.0,    0.0,    1.0],
        [0.0,   0.0,    2.0,    2.0,    1.0],
        [-2.0,  0.0,    2.0,    0.0,    1.0],
        [-2.0,  1.0,    0.0,    2.0,    1.0],
        [0.0,   0.0,    1.0,    -2.0,   0.0],
        [-1.0,  0.0,    1.0,    0.0,    0.0],
        [-2.0,  1.0,    0.0,    0.0,    0.0],
        [1.0,   0.0,    0.0,    0.0,    0.0],
        [0.0,   0.0,    1.0,    2.0,    0.0],
        [0.0,   0.0,    -2.0,   2.0,    2.0],
        [-1.0,  -1.0,   1.0,    0.0,    0.0],
        [0.0,   1.0,    1.0,    0.0,    0.0],
        [0.0,   -1.0,   1.0,    2.0,    2.0],
        [2.0,   -1.0,   -1.0,   2.0,    2.0],
        [0.0,   0.0,    3.0,    2.0,    2.0],
        [2.0,   -1.0,   0.0,    2.0,    2.0]
    ],

    coefficients = [
        // longitude1, longitude2, obliquity1, obliquity2
        [-171996.0, -174.2, 92025.0,8.9],
        [-13187.0,  -1.6,   5736.0, -3.1],
        [-2274.0,   -0.2,   977.0,  -0.5],
        [2062.0,    0.2,    -895.0,    0.5],
        [1426.0,    -3.4,    54.0,    -0.1],
        [712.0,    0.1,    -7.0,    0.0],
        [-517.0,    1.2,    224.0,    -0.6],
        [-386.0,    -0.4,    200.0,    0.0],
        [-301.0,    0.0,    129.0,    -0.1],
        [217.0,    -0.5,    -95.0,    0.3],
        [-158.0,    0.0,    0.0,    0.0],
        [129.0, 0.1,    -70.0,  0.0],
        [123.0, 0.0,    -53.0,  0.0],
        [63.0,  0.0,    0.0,    0.0],
        [63.0,  0.1,    -33.0,  0.0],
        [-59.0, 0.0,    26.0,   0.0],
        [-58.0, -0.1,   32.0,   0.0],
        [-51.0, 0.0,    27.0,   0.0],
        [48.0,  0.0,    0.0,    0.0],
        [46.0,  0.0,    -24.0,  0.0],
        [-38.0, 0.0,    16.0,   0.0],
        [-31.0, 0.0,    13.0,   0.0],
        [29.0,  0.0,    0.0,    0.0],
        [29.0,  0.0,    -12.0,  0.0],
        [26.0,  0.0,    0.0,    0.0],
        [-22.0, 0.0,    0.0,    0.0],
        [21.0,  0.0,    -10.0,  0.0],
        [17.0,  -0.1,   0.0,    0.0],
        [16.0,  0.0,    -8.0,   0.0],
        [-16.0, 0.1,    7.0,    0.0],
        [-15.0, 0.0,    9.0,    0.0],
        [-13.0, 0.0,    7.0,    0.0],
        [-12.0, 0.0,    6.0,    0.0],
        [11.0,  0.0,    0.0,    0.0],
        [-10.0, 0.0,    5.0,    0.0],
        [-8.0,  0.0,    3.0,    0.0],
        [7.0,   0.0,    -3.0,   0.0],
        [-7.0,  0.0,    0.0,    0.0],
        [-7.0,  0.0,    3.0,    0.0],
        [-7.0,  0.0,    3.0,    0.0],
        [6.0,   0.0,    0.0,    0.0],
        [6.0,   0.0,    -3.0,   0.0],
        [6.0,   0.0,    -3.0,   0.0],
        [-6.0,  0.0,    3.0,    0.0],
        [-6.0,  0.0,    3.0,    0.0],
        [5.0,   0.0,    0.0,    0.0],
        [-5.0,  0.0,    3.0,    0.0],
        [-5.0,  0.0,    3.0,    0.0],
        [-5.0,  0.0,    3.0,    0.0],
        [4.0,   0.0,    0.0,    0.0],
        [4.0,   0.0,    0.0,    0.0],
        [4.0,   0.0,    0.0,    0.0],
        [-4.0,  0.0,    0.0,    0.0],
        [-4.0,  0.0,    0.0,    0.0],
        [-4.0,  0.0,    0.0,    0.0],
        [3.0,   0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0],
        [-3.0,  0.0,    0.0,    0.0]
    ];

// MeanObliquityLaskar returns mean obliquity (ε₀) following the Laskar
// 1986 polynomial.
//
// Accuracy over the range 1000 to 3000 years is .01″.
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//
// NOTE:
//   Fixing a typo in U^8 from 2787 to 27.87 doesn't change anything in the
//   result.
nutation.calcMeanObliquityLaskar = function (T) {
    // (22.3) p. 147
    // NOTE : formular uses/needs Seconds
    //
    //  23° 26' 21''.448 in arcsec's
    //  = 84381.448
    return base.horner(T / 100,
        [84381.448, -4680.93, -1.55, 1999.25, -51.38, -249.67, -39.05, 7.12,
            27.87, 5.79, 2.45]) / 3600;
};

//
// The mean anomaly is the angular difference between a mean circular orbit
// and the true elliptic orbit.
//
// @param {T} Number - number of Julian centuries since J2000.
// @result Number - degrees  and is normalized to the range 0..360°.
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144
nutation.calcMeanAnomalySun = function (T) {
    var M = base.horner(T, [357.52772, 35999.050340, -0.0001603, -1/300000]);
    return base.pmod(M, 360);
};

// Longitude of the Moon's ascending node
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 144/164
nutation.calcOmega = function (T) {
    var Omega = base.horner(T, [125.04452, -1934.136261, 0.0020708, 1/450000]);
    return base.pmod(Omega, 360);
};

//
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 143+
nutation.calc = function (jd, ΔT) {

    if (ΔT === undefined) {
        throw "nutation.calc: missing ΔT";
    }

    var T = julian.j2000Century(jd, ΔT),

        Δψ = 0.0,
        Δε = 0.0,
        ra,

        coeffs,
        coeff_sine,
        coeff_cos,
        a,
        arg,

        /* calculate D,M,M',F and Omega */
        D = base.horner(T, [297.85036, 445267.111480, -0.0019142, 1 / 189474.0]),
        M = nutation.calcMeanAnomalySun(T),
        MM = base.horner(T, [134.96298, 477198.867398, 0.0086972, 1 / 56250.0]),
        F = base.horner(T, [93.2719100, 483202.017538, -0.0036825,  1 / 327270.0]),
        O = nutation.calcOmega(T),
        ε0 = nutation.calcMeanObliquityLaskar(T);

//    console.log('\nD', D, '\nM', M, '\nMM', MM, '\nF', F, '\nO', O);

    D *= base.DEG2RAD;
    M *= base.DEG2RAD;
    MM *= base.DEG2RAD;
    F *= base.DEG2RAD;
    O *= base.DEG2RAD;

    // calc sum of terms in table 21A
    for ( i = 0; i < TERMS; i += 1) {

        // calc coefficients of sine and cosine
        coeffs = coefficients[i];
        coeff_sine = coeffs[0] + (T * coeffs[1]);
        coeff_cos  = coeffs[2] + (T * coeffs[3]);

        a = args[i];
        arg = a[0] * D
            + a[1] * M
            + a[2] * MM
            + a[3] * F
            + a[4] * O;

        Δψ += coeff_sine * sin(arg);
        Δε += coeff_cos * cos(arg);
    }

    // change to arcsecs
    Δψ /= 10000;
    Δε /= 10000;

    // change to degrees
    Δψ /= 3600;
    Δε /= 3600;

    // nutation in right ascension in seconds of time
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 88, example 12a
    ra = (Δψ * 3600) *                     // n.Δψ in arcseconds
        cos((ε0 + Δε) * base.DEG2RAD) /    // cos of the true obliquity
        15;                                // correction in seconds of time

    return {
        T : T,              // T from Julian Ephemeris Day
        Δψ : Δψ,
        Δε : Δε,
        ε0 : ε0,
        ε  : ε0 + Δε,
        ra : ra,
        ra_dayFrac : ra / 86400
    };

};

module.exports = nutation;
