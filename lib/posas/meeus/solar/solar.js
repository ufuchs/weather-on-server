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
// The mean anomaly is the angular difference
// between a mean circular orbit and the true elliptic orbit.
//
// MEEUS, (25.3), p. 163
//
// @param {T} Number - number of Julian centuries since J2000.
// @result Number - radians and is not normalized to the range 0..2π.
//
solar.MeanAnomaly = function (T) {

    return base.Horner(T, [357.52911, 35999.05029, -0.0001537]) * base.DEG2RAD;

};

/*

// MeanAnomaly returns the mean anomaly of Earth at the given T.
//
// Argument T is the number of Julian centuries since J2000.
// See base.J2000Century.
//
// Result is in radians and is not normalized to the range 0..2π.
func MeanAnomaly(T float64) float64 {
    // (25.3) p. 163
    return base.Horner(T, 357.52911, 35999.05029, -0.0001537) * math.Pi / 180
}


// True returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
//
// Argument T is the number of Julian centuries since J2000.
// See base.J2000Century.
//
// Results:
//  s = true geometric longitude, ☉, in radians
//  ν = true anomaly in radians
func True(T float64) (s, ν float64) {
    // (25.2) p. 163
    L0 := base.Horner(T, 280.46646, 36000.76983, 0.0003032) *
        math.Pi / 180
    M := MeanAnomaly(T)
    C := (base.Horner(T, 1.914602, -0.004817, -.000014)*
        math.Sin(M) +
        (0.019993-.000101*T)*math.Sin(2*M) +
        0.000289*math.Sin(3*M)) * math.Pi / 180
    return base.PMod(L0+C, 2*math.Pi), base.PMod(M+C, 2*math.Pi)
}


*/

module.exports = solar;
