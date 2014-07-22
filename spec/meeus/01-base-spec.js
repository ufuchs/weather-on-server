/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */


var base = require('./../../lib/posas/meeus/base/base.js');

describe("Positive Modulo", function () {

    it("returns a value of 5", function () {

        var actual = base.pmod(-1075753.63317289, 86400),
            expected = 47446.36682711006;
            r = expected % 3600;

            // console.log(~~(expected / 3600));
            // console.log(~~(r / 60));
            // console.log(r % 60);

        expect(expected).toBe(actual);

    });

});

describe("Horner algorithm", function () {

    it("returns a value of 5", function () {

        var actual = base.horner(3, [-1, 2, -6, 2]),
            expected = 5;

        expect(expected).toBe(actual);

    });

});

describe("Century since J2K", function () {

    var jd_of_1987_Apr_10 = 2446895.5;

    // Meeus, p. 88, example 12.a
    it("returns a value of -0.127296372347... by 1987 April 10 00:00:00.0 UT", function () {

        var jd = jd_of_1987_Apr_10,

            actual = base.j2000Century(jd),
            expected = -0.12729637234770705;

        expect(expected).toBe(actual);

    });

    // Meeus, p. 89, examole 12.b
    it("returns a value of -0.127296372347... by 1987 April 10 19:00", function () {

        var jd = jd_of_1987_Apr_10 + 0.80625,

            actual = base.j2000Century(jd),
            expected = -0.12729637234770705;

        expect(expected).toBe(actual);

    });


});
