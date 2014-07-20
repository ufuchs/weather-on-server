/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */


var base = require('./../../lib/posas/meeus/base/math.js');

describe("", function () {

    // julian.calendarGregorianToJD
    it("", function () {

        var actual = base.horner(3, [-1, 2, -6, 2]),
            expected = 5;

        expect(expected).toBe(actual);

    });

});
