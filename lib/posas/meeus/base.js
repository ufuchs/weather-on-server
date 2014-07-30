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
base.RAD2DEG = 180.0 / Math.PI;

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

module.exports = base;