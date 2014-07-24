/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base/base.js'),
    solar = require('./../../lib/posas/meeus/solar/solar.js'),
    julian = require('./../../lib/posas/meeus/julian/julian.js'),
    jd_of_1992_Oct_13 = 2448908.5;

//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165
//        example 25.a
describe("Solar Coordinates", function () {

    var jd = jd_of_1992_Oct_13,
        s = {};

    s.T = julian.j2000Century(jd);

    it("needs the param 'T'", function () {

        // Comments refer to the values of:
        // MEEUS, Astronomical Algorithms (Second Edition), p. 165
        // example 25.a
        var T = -0.07218343600273786;
        //  T = -0.072183436;

        expect(s.T).toBe(T);

    });

    it("uses param 'T'", function () {

        // Comments refer to the values of:
        // MEEUS, Astronomical Algorithms (Second Edition), p. 165
        // example 25.a
        var actual = solar.calcTrueLonAndTrueAnomaly(s),
            L0   = 201.80719650670744,
        //  L0   = 201.80720
            M    = 278.9939664315975,
        //  M    = 278.99397
            C    = -1.897323843371985,
        //  C    = -1.89732
            dotO = 199.90987266333545,
        //  dotO = 199.909 88
            v    = 277.09664258822556;
        //  The True Anomaly is not mentioned in the example

        // The input params to calc finally the Sun's true longitude and true anomaly
        expect(s.L0).toBe(L0);
        expect(s.M).toBe(M);
        expect(s.C).toBe(C);            // Sun's equation of the center

        // The results of the calculation of the Sun's true longitude and
        // true anomaly
        expect(s.dotO).toBe(dotO);      // Sun's true longitude
        expect(s.v).toBe(v);            // Sun's true anomaly

    });

    // 1992 Oct 13 0h TD

/*

    var T  = -0.072 183 436,


        e  = 0.016 711 668,


        R  = 0.997 66,
        Ω  = 264°.65,
        λ  = 199°.908 95,
        ε0 = 23°.440 23   (by 22.2),
        ε  = 23°.439 99,
        alpha = 198°.380 83.
        beta  = -7°.785 07

*/


});
