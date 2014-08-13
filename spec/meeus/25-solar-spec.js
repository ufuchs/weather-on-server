/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/sunJS/meeus/base.js'),
    solar = require('./../../lib/sunJS/meeus/solar.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    julian = require('./../../lib/sunJS/meeus/julian.js'),
    jd_of_1992_Oct_13 = 2448908.5,
    jd_of_2007_Dec_14 = 2454449.5;

//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165
//        example 25.a
describe("Solar Coordinates", function () {

    var jd = jd_of_1992_Oct_13,
        T = julian.j2000Century(julian.jdAtMidnight(jd));

    it("needs the param 'T' at first. It's the base of all further calculations", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var expected = -0.07218343600273786;
        //  T = -0.072 183 436;

        expect(expected).toBe(T);

    });

    it("calculates finally the values of Sun's true longitude and true anomaly", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcTrueLonAndTrueAnomaly(T),
            L0   = 201.80719336623952,//201.80719650670744,
        //  L0   = 201.80720
            M    = 278.9925727892901,
        //  M    = 278.99397
            C    = -1.8973301894817716,
        //  C    = -1.89732
            dotO = 199.90986317675774,
        //> dotO = 199.90988
            v    =  277.09524259980833;
        //  The True Anomaly is not listed in the example


        expect(actual).toBe(dotO);      // Sun's true longitude


    });

    it("calculates the Sun's Apparent Right Ascension and Declination", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var dotO = solar.calcTrueLonAndTrueAnomaly(T),
            n = nutation.calc(T),
            actual = solar.calcAppPosition(T, dotO, n.ε),
            alpha = 198.3808274561914,
        //  α     = 198.38083.
            delta = -7.785039305745461;
        //  δ     = -7.78507

        expect(actual.alpha).toBe(alpha);
        expect(actual.delta).toBe(delta);

        console.log(actual);

    });

});
