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

var base = require('./base.js'),
//    nutation = require('./nutation.js'),
    julian = require('./julian.js'),
    sidereal = {};

// Calcs the Greenwich Mean Sidereal Time at 0h UT on the given JD
// @param {jd} Number - Julian Day number
// @return Number - Greenwich Mean Sidereal Time
sidereal.calcGmst0 = function (jd) {

    var T = julian.j2000Century(julian.jdAtMidnight(jd)),

        // iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
        //
        // The polynomial is in centuries from J2000.0, as given by JDToCFrac.
        // Coefficients are those adopted in 1982 by the International
        // Astronomical Union and are given in (12.2) p. 87.
        iau82 = [24110.54841, 8640184.812866, 0.093104, -0.0000062],

        gmst0 = base.horner(T, iau82);          // 0 =< x =< 86400

    return base.pmod(gmst0, 86400) / 86400;     // 0 =< x =< 1;

};

// Calcs the Greenwich Mean Sidereal Time for any given Universal Time
// @param {jd} Number - Julian Day number
// @return Number - Greenwich Mean Sidereal Time
sidereal.calcGmst = function (jd) {

    var gmst = sidereal.calcGmst0(jd)
        + julian.calendarDayFrac(jd) * 1.00273790935;

    return base.pmod(gmst, 1);                  // 0 < x < 1;

};

// Calcs the apparent Greenwich Mean Sidereal Time at 0h UT on the given JD
// @param {jd} Number - Julian Day number
// @param {n} Object - nutation
// @return Number - Apparent Greenwich Mean Sidereal Time
sidereal.calcGast0 = function (jd, n) {

    if (n === undefined) {
        throw "sidereal.calcGast0: missing param 'n'";
    }

    var gast0 = sidereal.calcGmst0(jd) + n.ra_dayFrac;
    return base.pmod(gast0, 1);                  // 0 < x < 1;
};

// Calcs the apparent Greenwich Mean Sidereal Time for any given Universal Time
// @param {jd} Number - Julian Day number
// @param {n} Object - nutation
// @return Number - Apparent Greenwich Mean Sidereal Time
sidereal.calcGast = function (jd, n) {

    if (n === undefined) {
        throw "sidereal.calcGast: missing param 'n'";
    }

    var gast = sidereal.calcGmst(jd) + n.ra_dayFrac;
    return base.pmod(gast, 1);                  // 0 < x < 1;
};

module.exports = sidereal;
