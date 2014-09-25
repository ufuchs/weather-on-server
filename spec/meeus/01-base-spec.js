/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */


var base = require('./../../lib/sunJS/meeus/base.js');

describe("Positive Modulo", function () {

    it("returns a value of 5", function () {

        var actual = base.pmod(-1075753.63317289, 86400),
            expected = 47446.36682711006;

        expect(expected).toBe(actual);

    });

});

describe("Seconds to Hour, Minutes, Seconds", function () {

    it("returns 2h 0m 0s", function () {

        var actual = base.sec2hhmmss(7200),
            expected = {
                sign : 1,
                hh : 2,
                mm : 0,
                ss : 0
            };

        expect(expected.sign).toBe(actual.sign);
        expect(expected.hh).toBe(actual.hh);
        expect(expected.mm).toBe(actual.mm);
        expect(expected.ss).toBe(actual.ss);

    });

    it("returns 2h 10m 10s", function () {

        var actual = base.sec2hhmmss(7810),
            expected = {
                sign : 1,
                hh : 2,
                mm : 10,
                ss : 10
            };

        expect(expected.sign).toBe(actual.sign);
        expect(expected.hh).toBe(actual.hh);
        expect(expected.mm).toBe(actual.mm);
        expect(expected.ss).toBe(actual.ss);

    });

    it("returns -2h 10m 10s", function () {

        var actual = base.sec2hhmmss(-7810),
            expected = {
                sign : -1,
                hh : 2,
                mm : 10,
                ss : 10
            };

        expect(expected.sign).toBe(actual.sign);
        expect(expected.hh).toBe(actual.hh);
        expect(expected.mm).toBe(actual.mm);
        expect(expected.ss).toBe(actual.ss);

    });

});

describe("Hour, Minutes, Seconds to Hour, Minutes", function () {

    it("returns 2h 10m", function () {

        var actual = base.hhmmss2hhmm(base.sec2hhmmss(7810)),
            expected = {
                sign : 1,
                hh : 2,
                mm : 10
            };

        expect(expected.sign).toBe(actual.sign);
        expect(expected.hh).toBe(actual.hh);
        expect(expected.mm).toBe(actual.mm);

    });

    it("returns -2h 10m", function () {

        var actual = base.sec2hhmmss(-7810),
            expected = {
                sign : -1,
                hh : 2,
                mm : 10
            };

        expect(expected.sign).toBe(actual.sign);
        expect(expected.hh).toBe(actual.hh);
        expect(expected.mm).toBe(actual.mm);

    });

});

describe("Horner algorithm", function () {

    it("returns a value of 5", function () {

        var actual = base.horner(3, [-1, 2, -6, 2]),
            expected = 5;

        expect(expected).toBe(actual);

    });

});
