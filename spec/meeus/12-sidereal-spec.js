/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var julian = require('./../../lib/posas/meeus/julian.js'),
    base = require('./../../lib/posas/meeus/base.js'),
    sidereal = require('./../../lib/posas/meeus/sidereal.js'),
    jd_of_1987_Apr_10 = 2446895.5;

//
//
//
describe("Mean Sidereal Time at Greenwich", function () {

    // Meeus, p. 88, part of example 12.a
    it("in pure degrees at 00:00", function () {

        // (m)ean0UT
        var actual = sidereal.calcGmst0(jd_of_1987_Apr_10),
            expected_gmst0 = 197.69319510799596;

//        console.log(julian.dec2hhmmss(actual / 360));

        expect(actual).toBe(expected_gmst0);

    });

    // Meeus, p. 89, example 12.b
    it("normalized like the seconds of a day at 19:21", function () {

        var actual = sidereal.calcGmst(jd_of_1987_Apr_10 + 0.80625),
            expected = 128.73787326321406;

//        console.log(julian.dec2hhmmss(actual / 360));

        expect(actual).toBe(expected);

    });

});

//
//
//
describe("Apparent Sidereal Time at Greenwich", function () {

    // Meeus, p. 88, part of example 12.a
    it("in pure degrees at 00:00", function () {

        // (m)ean0UT
        var actual = sidereal.calcGast0(jd_of_1987_Apr_10),
            expected_gast0 = 197.4569353685419;
                          // 197.69319510799596;

//        console.log(julian.dec2hhmmss(actual / 360));

        expect(actual).toBe(expected_gast0);

    });

});

