/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * deltaT
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * Partial Copyright 2013 Sonia Keys
 * MIT Licensed
 *
 * [ The secret of getting ahead is getting started.             - Mark Twain -]
 */

// @see: http://eclipse.gsfc.nasa.gov/LEcat5/deltat.html

var base = require('../base/base.js'),
    deltaT = {};

// c2000 returns centuries from calendar year 2000.0.
//
// Arg should be a calendar year.
function c2000(year) {
    return (year - 2000) * 0.01;
}

// Poly948to1600 returns a polynomial approximation valid for calendar
// years 948 to 1600.
deltaT.poly948to1600 = function(year) {
    // (10.2) p. 78
    return base.horner(c2000(year), [102, 102, 25.3]);
};

// PolyAfter2000 returns a polynomial approximation valid for calendar
// years after 2000.
deltaT.polyAfter2000Meeus = function(year) {

    var ΔT = deltaT.poly948to1600(year);

    if (year < 2100) {
        ΔT += 0.37 * (year - 2100);
    }

    return ΔT;

};

//
// Quote from
//   http://eclipse.gsfc.nasa.gov/LEcat5/deltat.html
// :
//
// In modern times, the determination of ΔT is made using atomic clocks and
// radio observations of quasars, so it is completely independent of the lunar
// ephemeris.
// Table 2 gives the value of ΔT every five years from 1955 to 2005
// (Astronomical Almanac for 2006, page K9).
//
// Table 2 - Recent Values of ΔT from Direct Observations
//
// Year    ΔT          5-Year Change  Average
//        (seconds)   (seconds)       1-Year Change
//                                    (seconds)
// 1955.0  +31.1        -   -
// 1960.0  +33.2        2.1             0.42
// 1965.0  +35.7        2.5             0.50
// 1970.0  +40.2        4.5             0.90
// 1975.0  +45.5        5.3             1.06
// 1980.0  +50.5        5.0             1.00
// 1985.0  +54.3        3.8             0.76
// 1990.0  +56.9        2.6             0.52
// 1995.0  +60.8        3.9             0.78
// 2000.0  +63.8        3.0             0.60
// 2005.0  +64.7        0.9             0.18
//
// Future changes and trends in ΔT can not be predicted with certainty since
// theoretical models of the physical causes are not of high enough precision.
// Extrapolations from the table weighted by the long period trend from tidal
// braking of the Moon offer reasonable estimates of
//
//   +67  seconds in 2010,
//   +93  seconds in 2050,
//   +203 seconds in 2100, and
//   +442 seconds in the year 2200.
//

//
//
//
deltaT.poly1986to2005Nasa = function(year) {

    // Quote from
    //   http://eclipse.gsfc.nasa.gov/LEcat5/deltatpoly.html
    // :
    //
    // Between years 1986 and 2005, calculate:
    //
    //      ΔT = 63.86 + 0.3345 * t - 0.060374 * t^2 + 0.0017275 * t^3 +
    //           0.000651814 * t^4 + 0.00002373599 * t^5
    //      where: t = y - 2000
    //

    return base.horner(year - 2000, [63.86, 0.3345, -0.060374, 0.0017275, 0.000651814, 0.00002373599]);

};

//
//
//
deltaT.poly2005to2050Nasa = function(year) {

    // Quote from
    //   http://eclipse.gsfc.nasa.gov/LEcat5/deltatpoly.html
    // :
    //
    // Between years 2005 and 2050, calculate:
    //
    //      ΔT = 62.92 + 0.32217 * t + 0.005589 * t^2
    //      where: t = y - 2000
    //
    // This expression is derived from estimated values of ΔT in the years
    // 2010 and 2050.
    // The value for 2010 (66.9 seconds) is based on a linearly extrapolation
    // from 2005 using 0.39 seconds/year (average from 1995 to 2005).
    // The value for 2050 (93 seconds) is linearly extrapolated from 2010
    // using 0.66 seconds/year (average rate from 1901 to 2000).

    return base.horner(year - 2000, [62.92, 0.32217, 0.005589]);

};

module.exports = deltaT;
