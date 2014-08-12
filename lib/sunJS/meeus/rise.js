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
    sidereal = require('./sidereal.js'),

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
rise.calcH0 = function (p) {

    var phi = p.phi * base.DEG2RAD,
        delta2 = p.delta[1] * base.DEG2RAD, // Sun's apparent declination today

        //           sin (h0) - sin (phi) * sin (delta2)
        // cos H0 = -------------------------------------
        //           cos (phi) * cos (delta2)
        num = sin(p.h0 * base.DEG2RAD) - sin(phi) * sin(delta2),
        denom = cos(phi) * cos(delta2),
        cosH0 = num / denom;

    // !indroduce exception!

    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (15.1)
    // citation:
    // "Attention! First test if the second member (cosH0) is between -1 and +1
    //  before calculating H0. See Note 2 at the end of this chapter."
    p.state = cosH0 < -1.0
        ? ALL_DAY_ABOVE_HORIZ
        : cosH0 > 1.0
            ? ALL_DAY_BELOW_HORIZ
            : RISE_AND_SET_ON_DAY;

    p.H0 = acos(cosH0) * base.RAD2DEG;

    return p;

};

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
rise.calcMValues = function (p) {

    var alpha2 = p.alpha[1],
        m = [];                     // 'm' are times, on day D, expresed
                                    // as fractioon of a day.

    m[0] = (alpha2 + p.L - p.gast0) / 360.0;
                                    // transit
    m[1] = m[0] - p.H0 / 360.0;     // rise
    m[2] = m[0] + p.H0 / 360.0;     // set

    p.m = m.map(function (m) {      // correct 'm' values into a range
                                    // of 0 < m < 1
        return m < 0.0
            ? m + 1.0
            : m > 1.0
                ? m - 1.0
                : m;

    });

    return p;

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


rise.interpol = function (r) {

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

        // The altitude is not needed for the time of transit.
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
    function calcdeltaM (H, h, h0, phi, delta) {

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

    var m0 = r.m[0],    // transit
        m1 = r.m[1],    // rise
        m2 = r.m[2],    // set
                        // all values as fraction of day 'D'

        //  MEEUS, chapter 12
        //  mean sidereal time at Greenwich for any instant

        // transit
        gmstM0 = base.pmod(r.gast0 + 360.985647 * m0, 360.0),
        n0 = m0 + r.deltaT,
        alpha0 = base.interpol(r.alpha, n0),
        // no delta
        H0 = gmstM0 - r.L - alpha0,
        // no altitude
        deltaM0 = - (H0 / 360.0),

        // rise
        gmstM1 = base.pmod(r.gast0 + 360.985647 * m1, 360.0),
        n1 = m1 + r.deltaT,
        alpha1 = base.interpol(r.alpha, n1),
        delta1 = base.interpol(r.delta, n1),
        H1 = gmstM1 - r.L - alpha1,
        h1 = calcAltitude(r.phi, delta1, H1),
        deltaM1 = calcdeltaM(H1, h1, r.h0, r.phi, delta1),

        // set
        gmstM2 = base.pmod(r.gast0 + 360.985647 * m2, 360.0),
        n2 = m2 + r.deltaT,
        alpha2 = base.interpol(r.alpha, n2),
        delta2 = base.interpol(r.delta, n2),
        H2 = gmstM2 - r.L - alpha2,
        h2 = calcAltitude(r.phi, delta2, H2),
        deltaM2 = calcdeltaM(H2, h2, r.h0, r.phi, delta2);

    // r.y = [];

    // r.y[0] = m0 + deltaM0;
    // r.y[1] = m1 + deltaM1;
    // r.y[2] = m2 + deltaM2;

    r.m[0] = m0 + deltaM0;
    r.m[1] = m1 + deltaM1;
    r.m[2] = m2 + deltaM2;

    return r;

};

//
// @params {p} Object -
//
rise.process = function (p) {

    /*
    p.gast0 = sidereal.calcGast0(p.jd) * 360.0;
    p.gmst = sidereal.calcGmst(p.jd) * 360;
    */

    p = rise.calcH0(p);
    p = rise.calcMValues(p);
    p = rise.interpol(p);

    return p;
};

module.exports = rise;
