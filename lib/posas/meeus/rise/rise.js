/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * rise
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 */

'use strict';

var base = require('../base/base.js'),
    julian = require('../julian/julian.js'),

    sin = Math.sin,
    cos = Math.cos,
    tan = Math.tan,
    atan = Math.atan,
    acos = Math.acos,

    rise = {},

    ALL_DAY_BELOW_HORIZ = 1,
    RISE_AND_SET_ON_DAY = 0,
    ALL_DAY_ABOVE_HORIZ = -1;

// @param {p} Object -  needs
//                      {phi}   geographical latitude of observer
//                      {delta} Sun's apparent declination
//                      {h0}    'standard' altitude of the center of the body
// @return Object    -  {H0}    hour angle
//                      {state} value of the second member
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

//
//
//
rise.calcMValues = function (p) {

    var m = [];

    //  Transit
    m[0] = p.alpha2 + p.phi - p.gmst0 / 360.0;

    //  Rise
    m[1] = m[0] - p.H0 / 360.0;

    //  Set
    m[2] = m[0] + p.H0 / 360.0;


    p.m = m.map(function(m) {
        return m < 0.0
            ? m + 1.0
            : m > 1.0
                ? m - 1.0
                : m;
    });

    return p;

};

/*

// MEUSS, (13.6)
// @param lat
// @param decl
// @param H
// @return
//
rise.calcAltitude = function (double lat, double decl, double H) {

    var lat = p.lat * MathEx.DEG2RAD,
        decl = MathEx.DEG2RAD,
        H = MathEx.DEG2RAD,
        sinh = sin(lat) * sin(decl) + cos(lat) * cos(decl) * cos(H);


    p.alt = asin(sinh) * MathEx.RAD2DEG;

    return p;

}

 MEEUS, Chapter 15, p.103
 @param h
 @param h0
 @param lat
 @param decl
 @param H
 @return

private double calc_deltaM(double h, double h0, double lat, double decl, double H) {

    lat *= MathEx.DEG2RAD;
    decl *= MathEx.DEG2RAD;
    H *= MathEx.DEG2RAD;

    double nom = h - h0;  //  values in degree
    double denom = 360.0 * Math.cos(lat) * Math.cos(decl) * Math.sin(H);

    return nom / denom;

}

    ////////////////////////////////////////////////////////////////////////////
    //  interpolation
    ////////////////////////////////////////////////////////////////////////////

    public void interpol(double lon, double lat, double h_0, double gmst0, double[] m, double[] ra, double[] decl, double deltaT ) {

        final double m0 = m[0];
        final double m1 = m[1];
        final double m2 = m[2];

        //  MEEUS, chapter 12
        //  mean sidereal time at Greenwich for any instant
        final double gmstM0 = MathEx.normalizeAngle(gmst0 + 360.985647 * m0, 360.0);
        final double gmstM1 = MathEx.normalizeAngle(gmst0 + 360.985647 * m1, 360.0);
        final double gmstM2 = MathEx.normalizeAngle(gmst0 + 360.985647 * m2, 360.0);

        final double n0 = m0 + (deltaT / 864000);
        final double n1 = m1 + (deltaT / 864000);
        final double n2 = m2 + (deltaT / 864000);

        final double ra0 = MathEx.interpol(ra, n0);
        final double ra1 = MathEx.interpol(ra, n1);
        final double ra2 = MathEx.interpol(ra, n2);

        final double decl1 = MathEx.interpol(decl, n1);
        final double decl2 = MathEx.interpol(decl, n2);

        //  'local hour angle' mit interpolierten Werten neu berechnen
        final double H0 = gmstM0 - lon - ra0;
        final double H1 = gmstM1 - lon - ra1;
        final double H2 = gmstM2 - lon - ra2;

        final double h1 = calcAltitude(lat, decl1, H1);
        final double h2 = calcAltitude(lat, decl2, H2);

        final double deltaM0 = - (H0 / 360.0);
        final double deltaM1 = calc_deltaM(h1, h_0, lat, decl1, H1);
        final double deltaM2 = calc_deltaM(h2, h_0, lat, decl2, H2);

        m[0] = m0 + deltaM0;
        m[1] = m1 + deltaM1;
        m[2] = m2 + deltaM2;

    }



*/



module.exports = rise;
