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
    nutation = require('./nutation.js'),
    julian = require('./julian.js'),
    sidereal = {};

// Mean0UT returns mean sidereal time at Greenwich at 0h UT on the given JD.
//
// The result is in seconds of time and is in the range [0,86400).
// Mean returns mean sidereal time at Greenwich for a given JD.
//
// Computation is by IAU 1982 coefficients.  The result is in seconds of
// time and is in the range [0,86400).
sidereal.calcGmst0 = function (jd) {

    var

        // iau82 is a polynomial giving mean sidereal time at Greenwich at 0h UT.
        //
        // The polynomial is in centuries from J2000.0, as given by JDToCFrac.
        // Coefficients are those adopted in 1982 by the International Astronomical
        // Union and are given in (12.2) p. 87.
        iau82 = [24110.54841, 8640184.812866, 0.093104, -0.0000062],

        gmst0 = base.horner(julian.j2000Century(jd), iau82);

    return base.pmod(gmst0, 86400) / 86400;     // 0 < x < 1;

};

//
//
//
sidereal.calcGmst = function (jd) {

    var gmst = sidereal.calcGmst0(jd)
            + julian.calendarDayFrac(jd) * 1.00273790935;

    return base.pmod(gmst, 1);                  // 0 < x < 1;

};

//
//
//
sidereal.calcGast0 = function (jd) {

    var T = julian.j2000Century(jd),
        n = nutation.calcNutation(T),
        ε0 = nutation.calcMeanObliquityLaskar(T);

    return sidereal.calcGmst0(jd) +
        nutation.calcNutationInRA(n, ε0) / 86400;

};

//
//
//
sidereal.calcGast = function (jd) {

    var T = julian.j2000Century(jd),
        n = nutation.calcNutation(T),
        ε0 = nutation.calcMeanObliquityLaskar(T);

    return sidereal.calcGmst(jd) +
        nutation.calcNutationInRA(n, ε0) / 86400;
};

module.exports = sidereal;
