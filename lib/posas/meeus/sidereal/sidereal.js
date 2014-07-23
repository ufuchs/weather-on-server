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
    sidereal = {};

sidereal.gmst = function (jd) {
    return sidereal.Mean(jd);
};

sidereal.gmst0 = function (jd) {
    return sidereal.Mean0UT(jd);
};


// Mean returns mean sidereal time at Greenwich for a given JD.
//
// Computation is by IAU 1982 coefficients.  The result is in seconds of
// time and is in the range [0,86400).
sidereal.Mean = function(jd) {

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

    var

        // iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
        //
        // The polynomial is in centuries from J2000.0, as given by JDToCFrac.
        // Coefficients are those adopted in 1982 by the International Astronomical
        // Union and are given in (12.2) p. 87.
        iau82 = [24110.54841, 8640184.812866, 0.093104, -0.0000062],

        gmst0 = base.horner(julian.j2000Century(jd), iau82),
        gmst = gmst0 + julian.calendarDayFrac(jd) * 1.00273790935 * 86400;

    return {
        gmst0 : gmst0,
        gmst : gmst
    };

};

module.exports = sidereal;
