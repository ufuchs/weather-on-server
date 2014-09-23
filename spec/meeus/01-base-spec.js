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

describe("Horner algorithm", function () {

    it("returns a value of 5", function () {

        var actual = base.horner(3, [-1, 2, -6, 2]),
            expected = 5;

        expect(expected).toBe(actual);

    });

});
