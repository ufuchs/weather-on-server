/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * sidereal
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ True friends stab you in the front.                       - Oscar Wilde - ]
 */

'use strict';

var base = require('../base/base.js'),
    julian = require('../julian/julian.js'),
    sidereal = {},

    // iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
    //
    // The polynomial is in centuries from J2000.0, as given by JDToCFrac.
    // Coefficients are those adopted in 1982 by the International Astronomical
    // Union and are given in (12.2) p. 87.
    iau82 = [24110.54841, 8640184.812866, 0.093104, -0.0000062];

// jdToCFrac returns values for use in computing sidereal time at Greenwich.
//
// Cen is centuries from J2000 of the JD at 0h UT of argument jd.  This is
// the value to use for evaluating the IAU sidereal time polynomial.
// DayFrac is the fraction of jd after 0h UT.  It is used to compute the
// final value of sidereal time.
sidereal.jdToCFrac = function (jd) {

    var f = (jd - ~~jd);

        return {
            cen : julian.j2000Century(jd),
            dayFrac : f < 0.5
                ? f + 0.5
                : 0
        };

};

// Mean returns mean sidereal time at Greenwich for a given JD.
//
// Computation is by IAU 1982 coefficients.  The result is in seconds of
// time and is in the range [0,86400).
sidereal.Mean = function (jd) {

    var mean0UT = sidereal.mean0UT(jd);

    return base.pmod(mean0UT.gmst, 86400);

};

// Mean0UT returns mean sidereal time at Greenwich at 0h UT on the given JD.
//
// The result is in seconds of time and is in the range [0,86400).
sidereal.Mean0UT = function (jd) {

    var mean0UT = sidereal.mean0UT(jd);

    return base.pmod(mean0UT.gmst0, 86400);

};

//
//
//
sidereal.mean0UT = function (jd) {

    var cFrac = sidereal.jdToCFrac(jd),
        gmst0 = base.horner(cFrac.cen, iau82);

    return {
        gmst0 : gmst0,
        dayFrac : cFrac.dayFrac,
        gmst : gmst0 + cFrac.dayFrac * 1.00273790935 * 86400
    };

};

module.exports = sidereal;
