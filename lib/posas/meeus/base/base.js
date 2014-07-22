/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * base
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * Partial Copyright 2013 Sonia Keys
 * MIT Licensed
 *
  */

var base = {};

base.DEG2RAD = Math.PI / 180.0;

// math ////////////////////////////////////////////////////////////////////////

// PMod returns a positive floating-point x mod y.
//
// For a positive argument y, it returns a value in the range [0,y).
//
// The result may not be useful if y is negative.
base.pmod = function (x, y) {

    var r = x % y;

    return r < 0
        ? r += y
        : r;
};

// Horner evaluates a polynomal with coefficients c at x.  The constant
// term is c[0].  The function panics with an empty coefficient list.
base.horner = function (x, coeffs) {

    return coeffs.reduceRight( function (acc, coeff) {
        return acc * x + coeff;
    }, 0);

};

// julian //////////////////////////////////////////////////////////////////////

    // Julian and Besselian years described in chapter 21, Precession.
    // T, Julian centuries since J2000 described in chapter 22, Nutation.

    // J2000 is the
var J2000 = 2451545.0,          // Julian date corresponding to January 1.5 year 2000.
    JULIAN_CENTURY = 36525;     // in days

// returns the number of Julian centuries since J2000.
//
// The quantity appears as T in a number of time series.
base.j2000Century = function(jd) {

    // Calculates the Julian Day at 00:00 of any given Julian Day value between
    // a human calendar day.
    // @param {jd} Number - (jd + .5) < x < (jd + 1) + 0.49999999999
    // @result Number = Julian Day number at 00:00 of the current calendar day
    function jdAtMidnight (jd) {

        var f = (jd - ~~jd),
            k = f < 0.5
            // Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
            // was die Julian Date Number um eins erhöht hat.
            // Dies ist per Subtraktion zu korrigieren.
            ? 1.0
            : 0;

        return Math.floor(jd - k) + 0.5; // 00:00 of the current day in calendar

    }

    // The formula is given in a number of places in the book, for example
    // (12.1) p. 87.
    // (22.1) p. 143.
    // (25.1) p. 163.
    return (jdAtMidnight(jd) - J2000) / JULIAN_CENTURY;

};

module.exports = base;
