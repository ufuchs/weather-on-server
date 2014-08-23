/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/sunJS/meeus/base.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    deltat = require('./../../lib/sunJS/meeus/deltat.js'),
    solar = require('./../../lib/sunJS/meeus/solar.js'),
    sidereal = require('./../../lib/sunJS/meeus/sidereal.js'),
    julian = require('./../../lib/sunJS/meeus/julian.js');

// Test coverage depends on the availability of examples/reference data
//
//
describe("Nutation and Obliqity of Ecliptic on 1988 April 10 at 0h UT", function () {

    var jde_of_1988_April_10 = 2446895.5,
        ΔT = deltat.poly1986to2005Nasa(1988),

        n = nutation.calc(jde_of_1988_April_10, ΔT),

        expected_ε0 = 23.440946290727506,           // 23° 26' 27".407
        expected_ε  = 23.44356921901489,            // 23° 26' 36".836

        expected_Δψ = -0.001052218026373891,        // -3".788
        expected_Δε = 0.0026229282873839635,        //  9".443
        expected_ra = -0.2316863784284621;          // -0.2317 sec


    it("gets the 'Mean Obliquity'", function () {

        // 23° 26' 27".406 646 619 022 865
        // console.log('Mean Obliquity:', base.degdec2degmmss(n.ε0));
        expect(n.ε0).toBe(expected_ε0);
    });

    it("gets the correction of the 'Mean Obliquity'", function () {

        // 9".442 541 834 582 268
        // console.log('\nCorr. of Mean Obliquity', base.degdec2degmmss(n.Δε));
        expect(n.Δε).toBe(expected_Δε);
    });

    it("gets the 'True Obliquity'", function () {

        // 23° 26' 36".849 188 453 603 574
        // console.log('\nTrue Obliquity', base.degdec2degmmss(n.ε));
        expect(n.ε).toBe(expected_ε);
    });

    it("gets the 'Nutation in Longitude'", function () {

        // -3".787 984 917 387 568 4
        // console.log('Nutation in Longitude:', base.degdec2degmmss(n.Δψ));
        expect(n.Δψ).toBe(expected_Δψ);
    });

    it("gets the 'Nutation in right ascentions'", function () {

        // -0.231 686 378 428 462 1 sec (of time)
        // console.log(n.ra);
        expect(n.ra).toBe(expected_ra);

    });

});

// example 13.b
//
//
describe("Nutation an Obliqity of Ecliptic on 1987 April 10 at 19h 21'", function () {

    var jd_of_1987_April_10_1921 = julian.calendarGregorianToJdA(1987, 4, 10, 19, 21, 0),
        ΔT = deltat.poly1986to2005Nasa(1988),

        n = nutation.calc(jd_of_1987_April_10_1921, ΔT),

        expected_ε0 = 23.440946003710337,
        expected_ε = 23.443575219584375,                // 23° 26' 36".87
        expected_Δψ = -0.0010742633560851776;           // -3".868

    it("gets the 'Mean Obliquity'", function () {

        // 23° 26' 27'.405 613 357 213 95
        // console.log('\nMean Obliquity:', base.degdec2degmmss(n.ε0));
        expect(n.ε0).toBe(expected_ε0);
    });

    it("gets the 'True Obliquity'", function () {

        // 23° 26' 36".870 790 503 749 05
        // console.log('\nTrue Obliquity:', base.degdec2degmmss(n.ε));
        expect(n.ε).toBe(expected_ε);
    });

    it("gets the 'Nutation in Longitude'", function () {

        // -3".867 348 081 906 639 5
        // console.log('Nutation in Longitude:', base.degdec2degmmss(n.Δψ));
        expect(n.Δψ).toBe(expected_Δψ);
    });

});

