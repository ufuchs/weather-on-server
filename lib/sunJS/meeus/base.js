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

'use strict';

var _ = require('lodash'),
    base = {};

base.DEG2RAD = Math.PI / 180.0;
base.RAD2DEG = 180.0 / Math.PI;

//
//
//
base.isNum = function (num) {
    return !((num === undefined) || (num === null) || (num === NaN));
}

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

// Splits the decimal notation of an angle into deg, min, sec
// @param {a} angle - angle in decimal notation
// @return Object - splitted angle
base.degdec2degmmss = function (a) {

    var deg = Math.abs(~~a),
        frac = Math.abs(a) - deg,
        mm = frac * 60,
        ss = (mm - ~~mm) * 60;

    mm = ~~mm;

    return {
        sign : a >= 0 ? 1 : -1,
        deg : deg,
        mm : ~~mm,
        ss : ss
    };

};

// Splits a number of seconds into hour, minute, seconds
// @param {num} Integer - number of seconds
// @return Object - A sign plus hours, minutes, seconds
// @api : private
base.sec2hhmmss = function (sec) {

    var reminder = Math.abs(sec) % 3600;  // remaining seconds of the uncomplete hour

    return {
        sign : sec >= 0 ? 1 : -1,
        hh : Math.floor(Math.abs(sec) / 3600),
        mm : Math.floor(reminder / 60),
        ss : reminder % 60
    };

};

// Drops the seconds from a given 'hhmmss' object
// @param {hhmmss} Object - the given 'hhmmss' object
// @return Object - a 'hhmm' object
// @api : private
base.hhmmss2hhmm = function (hhmmss) {
    return {
        sign : hhmmss.sign,
        hh : hhmmss.hh,
        mm : hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1),
    };
}



// Horner evaluates a polynomal with coefficients c at x.  The constant
// term is c[0].  The function panics with an empty coefficient list.
base.horner = function (x, coeffs) {

    if (x === null) {
        throw "base.horner: param 'x' is null";
    }

    if (coeffs === null) {
        throw "base.horner: param 'coeffs' is null";
    }

    return coeffs.reduceRight( function (acc, coeff) {
        return acc * x + coeff;
    }, 0);

};

module.exports = base;
