/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var sidereal = require('./../../lib/posas/meeus/sidereal/sidereal.js'),
    jd_of_1987_Apr_10 = 2446895.5;

//
//
//
describe("JD to century and fraction of the day", function () {

    var jd = jd_of_1987_Apr_10;

    it("returns the same day with f = 0", function () {

        var actual = sidereal.jdToCFrac(jd),
            expected_cen = -0.12729637234770705,
            expected_f = 0;

        // { jd0: 2446895.5, f: 0 }
        expect(actual.cen).toBe(expected_cen);
        expect(actual.dayFrac).toBe(expected_f);

    });

    it("returns the same day with f = 0.8", function () {

        var actual = sidereal.jdToCFrac(jd + 0.8),
            expected_cen = -0.12729637234770705,
            expected_f =  0.7999999998137355;

        // { jd0: 2446895.5, f: 0 }
        expect(actual.cen).toBe(expected_cen);
        expect(actual.dayFrac).toBe(expected_f);

    });


});

//
//
//
describe("Sidereal Time at Greenwich at 00:00", function () {

    it("in pure seconds", function () {

        var actual = sidereal.mean0UT(jd_of_1987_Apr_10 + 0.8),
            expected_gmst0 = -1075753.63317289,
            expected_dayFrac = 0;

        console.log(actual);

        expect(actual.gmst0).toBe(expected_gmst0);
        expect(actual.dayFrac).toBe(expected_dayFrac);

    });

});

//
// SHOULD FAIL --> 'jd_of_1987_Apr_10 + 0.8'
//
describe("Sidereal Time at Greenwich at 00:00", function () {

    it("normalized like the seconds of a day", function () {

        var actual = sidereal.Mean0UT(jd_of_1987_Apr_10 + 0.8),
            expected = 47446.36682711006;

        console.log(actual);

        expect(actual).toBe(expected);

        // var r = actual % 3600;
        // console.log(~~(actual / 3600));
        // console.log(~~(r / 60));
        // console.log(r % 60);

    });

});

