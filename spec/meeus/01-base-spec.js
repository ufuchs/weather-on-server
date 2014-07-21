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

    it("returns a value of 0.14550308008... by 2014 July 21 00:00:00.0 UT", function () {

        var jd = 2456859.5,

            actual = base.j2000Century(jd),
            expected = 0.14550308008213553;

        expect(expected).toBe(actual);

    });

    // Meeus, p. 88
    it("returns a value of -0.127296372347... by 1987 April 10 00:00:00.0 UT", function () {

        var jd = 2446895.5,

            actual = base.j2000Century(jd),
            expected = -0.12729637234770705;

        expect(expected).toBe(actual);

    });

});
