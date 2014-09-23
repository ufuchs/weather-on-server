/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * rise
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Quality means doing it right when no one is looking.       - Henry Ford -]
 *
 */

'use strict';

var base = require('./base.js'),
    interpol = require('./interpol.js'),
    sidereal = require('./sidereal.js'),
    julian = require('./julian.js'),

    sin = Math.sin,
    asin = Math.asin,
    cos = Math.cos,
    tan = Math.tan,
    atan = Math.atan,
    acos = Math.acos,

    rise = {},

    ALL_DAY_BELOW_HORIZ = 1,
    RISE_AND_SET_ON_DAY = 0,
    ALL_DAY_ABOVE_HORIZ = -1;

// Calculates the Hour Angle of the body
//
// @param {p} Object      - provides the following parameters:
//        {.phi} Number   - geographical latitude of observer
//        {.delta} Array  - Sun's apparent declination
//        {.h0} Numbwer   - 'standard' altitude of the center of the body
// @return Object         - adds the following new parameters to 'p':
//        {.H0} Number    - hour angle
//        {.state} Number - value of the second member
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (15.1)
rise.calcH0 = function (phi, delta2, h0) {

    phi = phi * base.DEG2RAD;
    delta2 = delta2 * base.DEG2RAD; // Sun's apparent declination today

        //           sin (h0) - sin (phi) * sin (delta2)
        // cos H0 = -------------------------------------
        //           cos (phi) * cos (delta2)
    var num = sin(h0 * base.DEG2RAD) - sin(phi) * sin(delta2),
        denom = cos(phi) * cos(delta2),
        cosH0 = num / denom;

    // !indroduce exception!

    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (15.1)
    // citation:
    // "Attention! First test if the second member (cosH0) is between -1 and +1
    //  before calculating H0. See Note 2 at the end of this chapter."

    /*
    p.state = cosH0 < -1.0
        ? ALL_DAY_ABOVE_HORIZ
        : cosH0 > 1.0
            ? ALL_DAY_BELOW_HORIZ
            : RISE_AND_SET_ON_DAY;
    */
    return acos(cosH0) * base.RAD2DEG;

};

// correct 'm' values into a range of 0 < m < 1
//
//
function adjustMValue(m) {
    return m < 0.0
        ? m + 1.0
        : m > 1.0
            ? m - 1.0
            : m;
}

// Calculates the transit, rise and set values
// @param {p} Object      - provides the following parameters:
//
//        {.L} Number     - geographical longitude of observer
//        {.alpha} Array  - Sun's apparent right ascension
//        {.gmst0} Number - Greenwich mean sidereal time at UT 0h
//
// @return Object         - adds the following new parameters to 'p':
//        {.m} Array      - [transit, rise, set]
//        {.state} Number - 0 = RISE_AND_SET_ON_DAY
//                          1 = ALL_DAY_BELOW_HORIZ (e.g polar nigth)
//                         -1 = ALL_DAY_ABOVE_HORIZ (e.g. polar day)
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102
rise.calcMValues = function (alpha2, L, gast0, H0) {

    var m = [];     // 'm' are times, on day D, expresed as fractioon of a day.

    m[0] = (alpha2 + L - gast0) / 360.0;    // transit
    m[1] = m[0] - H0 / 360.0;               // rise
    m[2] = m[0] + H0 / 360.0;               // set

    return m.map(function (m) {
        return adjustMValue(m);
    });

};


// @param {p} Object      - provides the following parameters:
//        {.phi}          - geographical latitude of observer
//        {.L} Number     - geographical longitude of observer
//        {.alpha} Array  - Sun's apparent right ascension
//        {.delta} Array  - Sun's apparent declination
//        {.gast0} Number - Greenwich apparant sideral time
//        {.H0} Number    - hour angle
//        {.deltaT} Number- deltaT = TD - UT (in seconds)
//        {.h0} Number    - the geometric altitude of the center of the body

rise.interpol = function (c, v, m) {

    // Calc the body's altitude.
    // @param {phi} Number   - geographical latitude of observer
    // @param {delta} Number - Sun's apparent declination
    // @param {H0} Number    - hour angle
    // @return Number        -  altitude in degree
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
    function calcAltitude (phi, delta, H) {

        phi = phi * base.DEG2RAD;
        delta = delta * base.DEG2RAD;
        H = H * base.DEG2RAD;

        var h = sin(phi) * sin(delta) + cos(phi) * cos(delta) * cos(H);

        return asin(h) * base.RAD2DEG;

    }

    // Calcs delta m for rise and set 'm'-values (m1 and m2)
    // @param {h} Numbwer   - altitude of the body
    // @param {h0} Number   - the geometric altitude of the center of the body
    // @param {phi} Number  - geographical latitude of observer
    // @param {delta} Nuber - Sun's apparent declination
    // @param {H0} Number   - hour angle
    // @return Number
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
    function calcdeltaM (h, h0, phi, delta, H) {

        phi = phi * base.DEG2RAD;
        delta = delta * base.DEG2RAD;
        H = H * base.DEG2RAD;

        //            h - h0
        // delta m = -------------------------------------
        //            360 * cos(delta) * cos(phi) * sin(H)
        var nom = h - h0,
            denom = 360.0 * cos(delta) * cos(phi) * sin(H);

        return nom / denom;

    }

    // this won't give exact results during/after interpolatiion:
    // [ 359.3613311535858, 0.2730734230117849, 1.1843291108587557 ]
    //
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 30
    function adjustAlphaAtVernalEquinox (alpha) {

        var alpha0 = alpha[0],
            alpha1 = alpha[1],
            alpha2 = alpha[2];

    if (alpha0 > alpha1) {
            alpha1 += 360.0;
        }
        if (alpha1 > alpha2) {
            alpha2 += 360.0;
        }
        return [alpha0, alpha1, alpha2];
    }

    // NOTE : all values are fractions of day 'D'
    var m0 = m[0],      // transit
        m1 = m[1],      // rise
        m2 = m[2],      // set

        gmstM0 = base.pmod(v.gast0 + 360.985647 * m0, 360.0),
        gmstM1 = base.pmod(v.gast0 + 360.985647 * m1, 360.0),
        gmstM2 = base.pmod(v.gast0 + 360.985647 * m2, 360.0),

        n0 = m0 + (c.deltaT / 86400),
        n1 = m1 + (c.deltaT / 86400),
        n2 = m2 + (c.deltaT / 86400),

        alpha = adjustAlphaAtVernalEquinox(v.alpha),

        alpha0 = interpol.linear(alpha, n0),
        alpha1 = interpol.linear(alpha, n1),
        alpha2 = interpol.linear(alpha, n2),

        // there is no 'delta0' to calc
        delta1 = interpol.linear(v.delta, n1),
        delta2 = interpol.linear(v.delta, n2),

        H0 = base.pmod(gmstM0 - c.L - alpha0, 360),
        H1 = base.pmod(gmstM1 - c.L - alpha1, 360),
        H2 = base.pmod(gmstM2 - c.L - alpha2, 360),

        // there is no 'h0' to calc
        h1 = calcAltitude(c.phi, delta1, H1),
        h2 = calcAltitude(c.phi, delta2, H2),

        deltaM0 = - (H0 / 360.0),
        deltaM1 = calcdeltaM(h1, c.h0, c.phi, delta1, H1),
        deltaM2 = calcdeltaM(h2, c.h0, c.phi, delta2, H2);

    m0 += deltaM0;
    m1 += deltaM1;
    m2 += deltaM2;

    return {
        date : v.date,
        transit : adjustMValue(m0),
        rise : adjustMValue(m1),
        set : adjustMValue(m2 < m1 ? m2 + 1 : m2)
    };

};

//
// @params {p} Object -
//
rise.process = function (c, v) {

    var H0 = rise.calcH0(c.phi, v.delta[1] , c.h0),
        m = rise.calcMValues(v.alpha[1] , c.L, v.gast0, H0);

    return rise.interpol(c, v, m);

};

module.exports = rise;
