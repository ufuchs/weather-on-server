/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base.js'),
    nutation = require('./../../lib/posas/meeus/nutation.js'),
    solar = require('./../../lib/posas/meeus/solar.js'),
    julian = require('./../../lib/posas/meeus/julian.js'),
    jd_of_1988_April_10 = 2446895.5;

//
//
//
describe("Obliqity of Ecliptic", function () {

    var T = julian.j2000Century(jd_of_1988_April_10),
        actual,
        expected = 23.440946290957324,

        expected_Δε = 0.002629995763497817,     //  9°.46798474859214
        expected_Δψ = -0.0010729882875282794;   // -3°.8627578351018057

    it("gets the 'Mean Obliquity'", function () {

        actual = nutation.calcMeanObliquityLaskar(T);

        expect(actual).toBe(expected);

    });

    it("gets the correction of the 'Mean Obliquity'", function () {

        actual = nutation.calcApproxNutation(T);

//      console.log(base.degdec2degmmss(actual.Δψ));
//      console.log(base.degdec2degmmss(actual.Δε));

        expect(actual.Δε).toBe(expected_Δε);
        expect(actual.Δψ).toBe(expected_Δψ);

    });

    it("gets the 'True Obliquity'", function () {

        var n = nutation.calcApproxNutation(T),
            expected_ε = 23.443576286720823;

        actual = nutation.calcMeanObliquityLaskar(T) + n.Δε;

//      console.log(base.degdec2degmmss(actual));

        expect(actual).toBe(expected_ε);

    });

    it("gets the nutation in RA", function () {

        var expected_ra = -0.23625973945406323;

        actual = nutation.calcNutationInRA(T);
//      console.log(base.degdec2degmmss(actual));

        expect(actual).toBe(expected_ra);

    });


});
