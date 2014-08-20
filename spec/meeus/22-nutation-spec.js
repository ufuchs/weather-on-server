/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/sunJS/meeus/base.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    solar = require('./../../lib/sunJS/meeus/solar.js'),
    sidereal = require('./../../lib/sunJS/meeus/sidereal.js'),

    julian = require('./../../lib/sunJS/meeus/julian.js'),
    jde_of_1988_April_10 = 2446895.5,
    ΔT = 55.8;

// Test coverage depends on the availability of examples/reference data
//
//
describe("Nutation and Obliqity of Ecliptic at 1988 April 10, 0h UT", function () {

    var //T = julian.j2000Century(jde_of_1988_April_10),
        actual,
        n = nutation.calc(jde_of_1988_April_10, ΔT),
        ε0;

    it("gets the 'Mean Obliquity'", function () {

        var expected_ε0 = 23.44094629072741;       // 23° 26' 27".407

        ε0 = n.ε0;

        // 23° 26' 27".406 647 446 367 458
//        console.log('Mean Obliquity:', base.degdec2degmmss(ε0));

        expect(ε0).toBe(expected_ε0);

    });

    it("gets the correction of the 'Mean Obliquity'", function () {


        var expected_Δε = 0.0026229282898315564,     //  9".457
            expected_Δψ = -0.0010522180326076578;   // -3".862

//      console.log(base.degdec2degmmss(n.Δψ));
//      console.log(base.degdec2degmmss(n.Δε));
        expect(n.Δε).toBe(expected_Δε);
        expect(n.Δψ).toBe(expected_Δψ);

    });

    it("gets the 'True Obliquity'", function () {

        var expected_ε = 23.443569219017242;        // 23° 26' 36".836

//      console.log(base.degdec2degmmss(n.ε));

        expect(n.ε).toBe(expected_ε);

    });

    it("gets the nutation in RA", function () {

        var expected_ra = -0.2316863798010621;

//      console.log(base.degdec2degmmss(n.ra));

        expect(n.ra).toBe(expected_ra);

    });

});


//
//
//
describe("Nutation an Obliqity of Ecliptic at 1987 April 10 19h 21'", function () {

    var jde_of_1987_April_10_1921 = julian.calendarGregorianToJdA(1987, 4, 10, 19, 21, 0),
        ΔT = 58.4,
        actual,
        n = nutation.calc(jde_of_1987_April_10_1921, ΔT),
        ε0;

    it("gets the 'Mean Obliquity'", function () {

        // example 13.b
        var expected_ε = 23.44357521976334;       // 23° 26' 36".87

        ε0 = n.ε;

        // 23° 26' 36".870 776 801 340 24
        // console.log('Mean Obliquity:', base.degdec2degmmss(ε0));
        // console.log('Mean Obliquity:', base.degdec2degmmss(n.Δψ));

        // console.log(sidereal.calcGmst(jde_of_1987_April_10_1921)  + n.ra_dayFrac);

        expect(ε0).toBe(expected_ε);

    });

});



