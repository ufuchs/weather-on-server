/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * posas
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The lack of money is the root of all evil.                 - Mark Twain - ]
 */

'use strict';

var MathU = require('./util/MathU.js'),
    posas = {},

    DAYS_PER_CENTURY = 36525.0,
    JD_CORR_TO_2000 = 2451545.0,
    HOURS_PER_DAY = 24;


// MEEUS, (12.4)
// @param {jd2k0} Number
// @param {jd} Number
// @return Number
posas.calcGmst = function (jd2k0, jd) {

    var T = jd2k0 / DAYS_PER_CENTURY,
        C1 = 280.46061837,
        C2 = 360.98564736629,
        C3 = 0.000387933,
        C4 = 1 / 38710000.0,
        result = C1 + C2 * (jd - JD_CORR_TO_2000) + T * (0 + T * (C3 - T * C4));

    return MathU.normalizeAngle(result, 360.0);

};

module.exports = posas;
