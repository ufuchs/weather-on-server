/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/sunJS/meeus/base.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    solar = require('./../../lib/sunJS/meeus/solar.js'),
    julian = require('./../../lib/sunJS/meeus/julian.js'),
    jd_of_1988_April_10 = 2446895.5;

//
//
//
describe("Obliqity of Ecliptic", function () {

    var T = julian.j2000Century(jd_of_1988_April_10),
        actual,
        n = nutation.calc(T),
        ε0;

    it("gets the 'Mean Obliquity'", function () {

        var expected_ε0 = 23.440946290957324;       // 23° 26' 27".407

        ε0 = n.ε0;

        // 23° 26' 27".406 647 446 367 458
//        console.log('Mean Obliquity:', base.degdec2degmmss(ε0));

        expect(ε0).toBe(expected_ε0);

    });

    it("gets the correction of the 'Mean Obliquity'", function () {

        var expected_Δε = 0.0026229224163215174,     //  9".457
            expected_Δψ = -0.0010522030768343293;   // -3".862

//      console.log(base.degdec2degmmss(n.Δψ));
//      console.log(base.degdec2degmmss(n.Δε));
        expect(n.Δε).toBe(expected_Δε);
        expect(n.Δψ).toBe(expected_Δψ);

    });

    it("gets the 'True Obliquity'", function () {

        var n = nutation.calc(T),
            expected_ε = 23.443569213373646;        // 23° 26' 36".836

//      console.log(base.degdec2degmmss(n.ε));

        expect(n.ε).toBe(expected_ε);

    });

    it("gets the nutation in RA", function () {

        var expected_ra = -0.2316830867206743;

//      console.log(base.degdec2degmmss(n.ra));

        expect(n.ra).toBe(expected_ra);

    });

});
