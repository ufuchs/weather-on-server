/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

// OK
var julian = require('./../../lib/sunJS/meeus/julian.js'),
    base = require('./../../lib/sunJS/meeus/base.js'),
    deltat = require('./../../lib/sunJS/meeus/deltat.js'),
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
        // console.log('gmst0', julian.dec2hhmmss(gmst0));
        expect(gmst0).toBe(expected_gmst0);
    });

    // Meeus, p. 89, part of example 12.b
    it("gets the fraction of a day at UT 19h 21''", function () {

        var gmst = sidereal.calcGmst(jd_of_1987_Apr_10
            + julian.hhmmss2dec(19, 21, 0));

        // 8h 34m 57".0895 8436240209
        // console.log('gmst', julian.dec2hhmmss(gmst) );
        expect(gmst).toBe(expected_gmst_1921);
    });

    // Meeus, p. 89, part of example 12.b
    it("returns in pure seconds at UT 07:21", function () {

        var gmst = sidereal.calcGmst(jd_of_1987_Apr_10
            + julian.hhmmss2dec(7, 21, 0));


        // 20h 32' 58".8119 0044240793
//        console.log('gmst', julian.dec2hhmmss(actual));

        expect(gmst).toBe(expected_gmst_0721);
    });


});

//
//
//
describe("Apparent Sidereal Time at Greenwich on 1987 Apr 10", function () {

        var jd_of_1987_Apr_10 = 2446895.5,
            expected_gast0 = 0.5491450826854554,
            expected_gast = 0.3576024658368484;

    // Meeus, p. 88, part of example 12.a
    it("returns in pure seconds at UT 00:00", function () {

        var gast0 = sidereal.calcGast0(jd_of_1987_Apr_10);

        // 13h 10m 46".1351
        // console.log('gast0', julian.dec2hhmmss(gast0));
        expect(gast0).toBe(expected_gast0);
    });

    // Meeus, p. 88, part of example 12.a
    it("returns in pure seconds at UT 19:21", function () {

        var gast = sidereal.calcGast(jd_of_1987_Apr_10 +
                julian.hhmmss2dec(19, 21, 0));

        // 8° 34' 56".8579 012756818
        // console.log('gast', julian.dec2hhmmss(actual));

        expect(gast).toBe(expected_gast);

    });

});

