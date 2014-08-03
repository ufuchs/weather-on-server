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
    nutation = {},

    nutation_arguments = [
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

    nutation_coefficients = [
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
// Accuracy over the valid date range of -8000 to +12000 years is
// "a few seconds."
//
// Result unit is radians.

//
// mean obliquity of the ecliptic.
//
// "The adjective 'mean' indicates that the correction for nutation is NOT
//  taken into account!"
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 147, (22.2)
//

nutation.calcMeanObliquityLaskar = function (T) {
    // (22.3) p. 147
    // NOTE : formular uses/needs Seconds
    //
    //  23° 26' 21''.448 in arcsec's
    //  = 23 * 3600'' + 26 * 60'' + 21.448''
    //  = 82800'' + 1560'' + 21.448''
    //  = 84381.448
    return base.horner(T / 100,
        [84381.448, -4680.93, -1.55, 1999.25, -51.38, -249.67, -39.05, 7.12,
            2787, 5.79, 2.45]) / 3600;
}

//
//
//
nutation.calcNutation = function (T) {

    var

        coeff_sine,
        coeff_cos;
        argument,


        /* calculate D,M,M',F and Omega */
        D = base.horner(T, [297.85036, 445267.111480, -0.0019142, 1 / 189474.0]),
        M = base.horner(T, [357.52772, 35999.050340,  -0.0001603,  -1 / 300000.0]),
        MM = base.horner(T, [134.96298, 477198.867398, 0.0086972, 1 / 56250.0]),
        F = base.horner(T, [93.2719100, 483202.017538, -0.0036825,  1 / 327270.0]),
        O = base.horner(T, [125.04452, -934.136261, 0.0020708, 1 / 450000.0]);

    D *= base.DEG2RAD;
    M *= base.DEG2RAD;
    MM *= base.DEG2RAD;
    F *= base.DEG2RAD;
    O *= base.DEG2RAD;

/*

    // calc sum of terms in table 21A
    for (i=0; i< TERMS; i++) {
        // calc coefficients of sine and cosine
        coeff_sine = (coefficients[i].longitude1 + (coefficients[i].longitude2 * T));
        coeff_cos = (coefficients[i].obliquity1 + (coefficients[i].obliquity2 * T));

        argument = arguments[i].D * D
            + arguments[i].M * M
            + arguments[i].MM * MM
            + arguments[i].F * F
            + arguments[i].O * O;

        c_longitude += coeff_sine * sin(argument);
        c_obliquity += coeff_cos * cos(argument);
    }

    // change to arcsecs
    c_longitude /= 10000;
    c_obliquity /= 10000;

    // change to degrees
    c_longitude /= (60 * 60);
    c_obliquity /= (60 * 60);

    // calculate mean ecliptic - Meeus 2nd edition, eq. 22.2
    c_ecliptic = 23.0 + 26.0 / 60.0 + 21.448 / 3600.0
               - 46.8150/3600 * T
               - 0.00059/3600 * T2
               + 0.001813/3600 * T3;

    c_ecliptic += c_obliquity; * Uncomment this if function should
                                     return true obliquity rather than
                                     mean obliquity


*/


};



// NutationInRA returns "nutation in right ascension" or "equation of the
// equinoxes."
//
// Result is an angle in radians.
nutation.calcNutationInRA = function (T) {
    var n = nutation.calcApproxNutation(T),
        ε0 = nutation.calcMeanObliquity(T),
        ε = ε0 + n.Δε;

    return (n.Δψ) * cos(ε * base.DEG2RAD);// / 15;

}

module.exports = nutation;
