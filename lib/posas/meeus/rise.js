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
// @param {p} Object -  needs
//                      {phi}    geographical latitude of observer
//                      {delta2} Sun's apparent declination
//                      {h0}     'standard' altitude of the center of the body
// @return Object    -  {H0}     hour angle
//                      {state}  value of the second member
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (15.1)
rise.calcH0 = function (p) {

    var phi = p.phi * base.DEG2RAD,         // geographical latitude of observer
        delta2 = p.delta[1] * base.DEG2RAD, // Sun's apparent declination today

        //
        //           sin (h0) - sin (phi) * sin (delta2)
        // cos H0 = -------------------------------------
        //           cos (phi) * cos (delta2)
        //

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
// @param {p} Object -  needs
//                      {L}      geographical longitude of observer
//                      {alpha2} Sun's apparent right ascension
//                      {gmst0}  Greenwich mean sidereal time at UT 0h
// @return Object    -  {m}      Array with transit, rise and set values
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102
rise.calcMValues = function (p) {

    var alpha2 = p.alpha[1],
        m = [];

    //  Transit
    m[0] = (alpha2 + p.L - p.gast0) / 360.0;

    //  Rise
    m[1] = m[0] - p.H0 / 360.0;

    //  Set
    m[2] = m[0] + p.H0 / 360.0;

    p.m = m.map(function (m) {

        return m < 0.0
            ? m + 1.0
            : m > 1.0
                ? m - 1.0
                : m;

    });

    return p;

};

//
//
//
rise.interpol = function (r) {

    //
    // Calc the body's atitude.
    // @param {p} Object -  needs
    //                      {phi}    geographical latitude of observer
    //                      {alpha2} Sun's apparent right ascension
    //                      {gmst0}  Greenwich mean sidereal time at UT 0h
    // @return Object    -  {akt}    Array with transit, rise and set values
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
    function calcAltitude (phi, delta, H) {  //lat, decl, H

        phi = phi * base.DEG2RAD;
        delta = delta * base.DEG2RAD;
        H = H * base.DEG2RAD;

        var h = sin(phi) * sin(delta) + cos(phi) * cos(delta) * cos(H);

        // This altitude is not needed for the time of transit.
        return asin(h) * base.RAD2DEG;

    }

    // Calcs delta m for rise and set 'm'-values (m1 and m2)
    // @param {h} Number
    // @param {h0} Number
    // @param {phi} Number
    // @param {delta} Nuber
    // @param {H} Number
    // @return
    // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
    function calcdeltaM (h, h0, phi, delta, H) {

        phi = phi * base.DEG2RAD;
        delta = delta * base.DEG2RAD;
        H = H * base.DEG2RAD;

            //
            //            h - h0
            // delta m = -------------------------------------
            //            360 * cos(delta) * cos(phi) * sin(H)
            //

        var nom = h - h0,  //  values in degree
            denom = 360.0 * cos(delta) * cos(phi) * sin(H);

        return nom / denom;

    }

    var m0 = r.m[0],
        m1 = r.m[1],
        m2 = r.m[2],

        //  MEEUS, chapter 12
        //  mean sidereal time at Greenwich for any instant
        gmstM0 = base.pmod(r.gast0 + 360.985647 * m0, 360.0),
        gmstM1 = base.pmod(r.gast0 + 360.985647 * m1, 360.0),
        gmstM2 = base.pmod(r.gast0 + 360.985647 * m2, 360.0),

        n0 = m0 + r.deltaT,
        n1 = m1 + r.deltaT,
        n2 = m2 + r.deltaT,

        alpha0 = base.interpol(r.alpha, n0),
        alpha1 = base.interpol(r.alpha, n1),
        alpha2 = base.interpol(r.alpha, n2),

        delta1 = base.interpol(r.delta, n1),
        delta2 = base.interpol(r.delta, n2),

        //  'local hour angle' mit interpolierten Werten neu berechnen
        H0 = gmstM0 - r.L - alpha0,
        H1 = gmstM1 - r.L - alpha1,
        H2 = gmstM2 - r.L - alpha2,

        h1 = calcAltitude(r.phi, delta1, H1),
        h2 = calcAltitude(r.phi, delta2, H2),

        deltaM0 = - (H0 / 360.0),
        deltaM1 = calcdeltaM(h1, r.h0, r.phi, delta1, H1),
        deltaM2 = calcdeltaM(h2, r.h0, r.phi, delta2, H2);

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

    p = rise.calcH0(p);
    p = rise.calcMValues(p);
    p = rise.interpol(p);

    return p;
};

module.exports = rise;
