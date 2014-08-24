/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */


var base = require('./../../lib/sunJS/meeus/base.js');

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

describe("interpolation", function () {

    it("returns a value of 5", function () {

        var values = [0.884226, 0.877366, 0.870531],
            actual = base.interpol(values, 0.18125),
            expected = 0.8761253012695313;

        expect(expected).toBe(actual);

    });

});


