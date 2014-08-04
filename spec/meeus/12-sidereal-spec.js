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
    it("returns in pure seconds at 00:00", function () {

        // (m)ean0UT
        var actual = sidereal.calcGmst0(jd_of_1987_Apr_10),
            expected_gmst0 = 47446.36682711006;

        // 13h 10m 46".3668 2711006142
//        console.log(julian.dec2hhmmss(actual / 86400));

        expect(actual).toBe(expected_gmst0);

    });

    // Meeus, p. 89, part of example 12.b
    it("returns in pure seconds at 19:21", function () {

        var actual = sidereal.calcGmst(jd_of_1987_Apr_10 +
                julian.hhmmss2dec(19, 21, 0)),
            expected_gmst = 30897.089584362402;

        // 8h 34m 57".0895 8436240209
//        console.log(julian.dec2hhmmss(actual / 86400));

        expect(actual).toBe(expected_gmst);

    });

});

//
//
//
describe("Apparent Sidereal Time at Greenwich", function () {

    // Meeus, p. 88, part of example 12.a
    it("returns in pure seconds at 00:00", function () {

        // (m)ean0UT
        var actual = sidereal.calcGast0(jd_of_1987_Apr_10),
            expected_gast0 = 47446.13514402334;

        // 13h 10m 46".1351
//        console.log(julian.dec2hhmmss(actual / 86400));

        expect(actual).toBe(expected_gast0);

    });

    // Meeus, p. 88, part of example 12.a
    it("returns in pure seconds at 19:21", function () {

        // (m)ean0UT
        var actual = sidereal.calcGast(jd_of_1987_Apr_10 +
                julian.hhmmss2dec(19, 21, 0)),
            expected_gast = 30896.85790127568;

        // 8° 34' 56".8579 012756818
        console.log(julian.dec2hhmmss(actual / 86400));

        expect(actual).toBe(expected_gast);

    });


});

