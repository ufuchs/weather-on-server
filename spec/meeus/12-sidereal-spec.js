/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var sidereal = require('./../../lib/posas/meeus/sidereal/sidereal.js'),
    jd_of_1987_Apr_10 = 2446895.5;

//
//
//
describe("Sidereal Time at Greenwich", function () {

    it("in pure seconds at 00:00", function () {

        // (m)ean0UT
        var actual = sidereal.mean0UT(jd_of_1987_Apr_10),
            expected_gmst0 = -1075753.63317289;

        expect(actual.gmst0).toBe(expected_gmst0);

    });

    // Meeus, p. 88, part of example 12.a
    it("normalized like the seconds of a day at 00:00", function () {

        // (M)ean0UT
        var actual = sidereal.Mean0UT(jd_of_1987_Apr_10),
            expected = 47446.36682711006;

        expect(actual).toBe(expected);

        // var r = actual % 3600;
        // console.log(~~(actual / 3600));
        // console.log(~~(r / 60));
        // console.log(r % 60);

    });

    // Meeus, p. 89, example 12.b
    it("normalized like the seconds of a day at 19:21", function () {

        var actual = sidereal.Mean(jd_of_1987_Apr_10 + 0.80625),
            expected = 30897.08958436246;

        expect(actual).toBe(expected);

        // var r = actual % 3600;
        // console.log(~~(actual / 3600));
        // console.log(~~(r / 60));
        // console.log(r % 60);

    });

});


