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

// Horner evaluates a polynomal with coefficients c at x.  The constant
// term is c[0].  The function panics with an empty coefficient list.
base.horner = function (x, coeffs) {

    return coeffs.reduceRight( function (acc, coeff) {
        return acc * x + coeff;
    }, 0);

};

module.exports = base;
