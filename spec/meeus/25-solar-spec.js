/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/sunJS/meeus/base.js'),
    solar = require('./../../lib/sunJS/meeus/solar.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    julian = require('./../../lib/sunJS/meeus/julian.js'),
    jd_of_2007_Dec_14 = 2454449.5;

//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165
//        example 25.a
describe("Solar Coordinates on 1992 Oct 13 at 0h DT", function () {

    var jde_of_1992_Oct_13 = 2448908.5,
        ΔT = 0, //56.9,
        T = julian.j2000Century(jde_of_1992_Oct_13, ΔT),

        L0   = 201.80719336623952,              //  201.80720
        M    = 278.9925727892901,               //  278.99397
        C    = -1.8973301894817716,             //  -1.89732
        expected_dotO = 199.90986317675774,     //> dotO = 199.90988
        expected_alpha = 198.38081636750388,    //  198.38083
        expected_delta = -7.7850662562212065;   //   -7.78507
        //  The True Anomaly is not listed in the example

    it("gets the 'Sun's true longitude", function () {

        var dot0 = solar.calcTrueLonAndTrueAnomaly(T);
        expect(dot0).toBe(expected_dotO);
    });

    it("gets the 'Sun's Apparent Right Ascension and Declination'", function () {

        var dotO = solar.calcTrueLonAndTrueAnomaly(T),
            n = nutation.calc(jde_of_1992_Oct_13, ΔT),
            appPos = solar.calcAppPosition(T, dotO, n.ε0);

        expect(appPos.alpha).toBe(expected_alpha);
        expect(appPos.delta).toBe(expected_delta);
    });

});
