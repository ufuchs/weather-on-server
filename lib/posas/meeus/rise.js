/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * rise
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 * [ Quality means doing it right when no one is looking.        - Henry Ford -]
 *
 * [ When everything seems to be going against you, remember that the airplane ]
 * [ takes off against the wind, not with it.                   - Henry Ford - ]
 *
 */

'use strict';

var base = require('./base.js'),
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

// Creates a parameter object for the calculation
// @
// @
// @result Object - new parameter object
rise.initialize = function (deltaT, h0) {
    return {
        deltaT : deltaT,    //  diff from TD - UT
        h0 : h0             // 'standard' altitude of the center of the body
    }
}

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
        delta2 = p.delta2 * base.DEG2RAD,   // Sun's apparent declination

        //
        //           sin (h0) - sin (phi) * sin (delta2)
        // cos H0 = -------------------------------------
        //           cos (phi) * cos (delta2)
        //

        num = sin(p.h0 * base.DEG2RAD) - sin(phi) * sin(delta2),
        denom = cos(phi) * cos(delta2),
        cosH0 = num / denom;

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

    var m = [];

    //  Transit
    m[0] = (p.alpha2 + p.L - p.gmst0) / 360.0;

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

// Find the sidereal time at Greenwich
// @param {Theta0} Number - Greenwich mean sidereal time
// @param {m} Number - single 'm'-value for rise, set or transit
// @return Number - sidereal time at Greenwich
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 103
rise.calctheta0 = function (Theta0, m) {
    var theta0 = Theta0 + 360.985647 * m;
    return base.pmod(theta0, 360);
};

// Find the local hour angle from the body
// @param {theta0} Number - sidereal time at Greenwich for a particular 'm'-value
// @param {L} Number - geographical longitude of observer
// @param {alpha} Number - Sun's apparent right ascension
// @return Number -
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 103
rise.calcH = function (theta0, L, alpha) {
    return theta0 - L - alpha;
};

// -> Formular 13.6 ansehen
//
// Calc the body's atitude.
// @param {p} Object -  needs
//                      {phi}    geographical latitude of observer
//                      {alpha2} Sun's apparent right ascension
//                      {gmst0}  Greenwich mean sidereal time at UT 0h
// @return Object    -  {akt}    Array with transit, rise and set values
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
rise.calcAltitude = function (phi, delta, H) {  //lat, decl, H

    phi = phi * base.DEG2RAD;
    delta = delta * base.DEG2RAD;
    H = H * base.DEG2RAD;

    var h = sin(phi) * sin(delta) + cos(phi) * cos(delta) * cos(H);

    // This altitude is not needed for the time of transit.
    return asin(h) * base.RAD2DEG;

};

// Calcs delta m for rise and set 'm'-values (m1 and m2)
// @param {h} Number
// @param {h0} Number
// @param {phi} Number
// @param {delta} Nuber
// @param {H} Number
// @return
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 102, (13.6)
rise.calc_deltaM = function (h, h0, phi, delta, H) {

    phi = phi * base.DEG2RAD;
    delta = delta * base.DEG2RAD;
    H = H * base.DEG2RAD;

        //
        //            h - h0
        // delta m = -------------------------------------
        //            360 * cos(delta) * cos(phi) * sin(H)
        //

    var nom = h - h0,  //  values in degree
        denom = 360.0 * cos(delta) * Math.cos(phi) * sin(H);

    return nom / denom;

};




////////////////////////////////////////////////////////////////////////////
//  interpolation
////////////////////////////////////////////////////////////////////////////

rise.interpol = function (r) {

    var m0 = r.m[0],
        m1 = r.m[1],
        m2 = r.m[2],

    //  MEEUS, chapter 12
    //  mean sidereal time at Greenwich for any instant
        gmstM0 = base.pmod(r.gmst0 + 360.985647 * m0, 360.0),
        gmstM1 = base.pmod(r.gmst0 + 360.985647 * m1, 360.0),
        gmstM2 = base.pmod(r.gmst0 + 360.985647 * m2, 360.0),

        n0 = m0 + (r.deltaT / 864000),
        n1 = m1 + (r.deltaT / 864000),
        n2 = m2 + (r.deltaT / 864000),

        ra0 = base.interpol(r.alpha, n0),
        ra1 = base.interpol(r.alpha, n1),
        ra2 = base.interpol(r.alpha, n2),

        decl1 = base.interpol(r.delta, n1),
        decl2 = base.interpol(r.delta, n2),

    //  'local hour angle' mit interpolierten Werten neu berechnen
        H0 = gmstM0 - r.L - ra0,
        H1 = gmstM1 - r.L - ra1,
        H2 = gmstM2 - r.L - ra2,

        h1 = rise.calcAltitude(r.phi, decl1, H1),
        h2 = rise.calcAltitude(r.phi, decl2, H2),

        deltaM0 = - (H0 / 360.0),
        deltaM1 = rise.calc_deltaM(h1, r.h0, r.phi, decl1, H1),
        deltaM2 = rise.calc_deltaM(h2, r.h0, r.phi, decl2, H2);

    r.m[0] = m0 + deltaM0;
    r.m[1] = m1 + deltaM1;
    r.m[2] = m2 + deltaM2;

    return r;

}


module.exports = rise;
