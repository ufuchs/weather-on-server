/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

// OK
var julian = require('./../../lib/sunJS/meeus/julian.js'),
    base = require('./../../lib/sunJS/meeus/base.js'),
    deltat = require('./../../lib/sunJS/meeus/deltat.js'),
    nutation = require('./../../lib/sunJS/meeus/nutationHigherAcc.js'),
    sidereal = require('./../../lib/sunJS/meeus/sidereal.js');

//
//
//
describe("Mean Sidereal Time at Greenwich on 1987 Apr 10", function () {

    var jd_of_1987_Apr_10 = 2446895.5,
        expected_gmst0 = 0.5491477642026628,
        expected_gmst_1921 = 0.35760520352271286,
        expected_gmst_0721 = 0.856236248847713;

    // calcGmst0
    // Meeus, p. 88, part of example 12.a
    it("gets the fraction of a day at UT 0h", function () {

        var gmst0 = sidereal.calcGmst0(jd_of_1987_Apr_10);

        // 13h 10m 46".366 827 110 061 42
        // console.log('\ngmst0', julian.dec2hhmmss(gmst0));
        expect(gmst0).toBe(expected_gmst0);
    });

    // Meeus, p. 89, part of example 12.b
    it("gets the fraction of a day at UT 19h 21''", function () {

        var gmst = sidereal.calcGmst(jd_of_1987_Apr_10
            + julian.hhmmss2dec(19, 21, 0));

        // 8h 34m 57".089 584 362 402 09
        // console.log('\ngmst', julian.dec2hhmmss(gmst) );
        expect(gmst).toBe(expected_gmst_1921);
    });

    // Meeus, p. 89, part of example 12.b
    it("gets the fraction of a day at UT 07:21", function () {

        var gmst = sidereal.calcGmst(jd_of_1987_Apr_10
            + julian.hhmmss2dec(7, 21, 0));

        // 20h 32' 58".811 900 442 407 93
        // console.log('\ngmst', julian.dec2hhmmss(gmst));
        expect(gmst).toBe(expected_gmst_0721);
    });

});

// Meeus, p. 88, part of example 12.a
//
//
describe("Apparent Sidereal Time at Greenwich on 1987 Apr 10", function () {

        var jd_of_1987_Apr_10 = 2446895.5,
            ΔT = deltat.poly1986to2005Nasa(1987),
            n = nutation.calc(jd_of_1987_Apr_10, ΔT),
            expected_gast0 = 0.5491450826476714,
            expected_gast = 0.35760252196772147;

    it("gets the fraction of a day at UT 00:00", function () {

        var gast0 = sidereal.calcGast0(jd_of_1987_Apr_10, n);

        // 13h 10m 46".135 140 758 808 12
        // console.log('gast0', julian.dec2hhmmss(gast0));
        expect(gast0).toBe(expected_gast0);
    });

    it("gets the fraction of a day at UT 19:21", function () {

        var gast = sidereal.calcGast(jd_of_1987_Apr_10 +
                julian.hhmmss2dec(19, 21, 0), n);

        // 8° 34' 56".857 898 011 134 24
        // console.log('gast', julian.dec2hhmmss(gast));
        expect(gast).toBe(expected_gast);
    });

});
