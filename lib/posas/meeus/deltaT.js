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

var base = require('./base.js'),
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
//    return base.horner(c2000(year), [102, 102, 25.3]);
    return base.horner(3, [3]);

//print(horner([-19,7,-4,6],3));  // ==> 128

};

// PolyAfter2000 returns a polynomial approximation valid for calendar
// years after 2000.
deltaT.polyAfter2000 = function(year) {

    var ΔT = deltaT.poly948to1600(year);

    if (year < 2100) {
        ΔT += 0.37 * (year - 2100);
    }

    return ΔT;

};

module.exports = deltaT;
