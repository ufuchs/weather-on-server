/*jslint node: true */
/*jslint todo: true */

var timebase = require('../lib/posas/timebase.js'),
    tb = timebase();



console.log(tb.update());

describe("timebase", function () {


    it("shouldn't be null or undefined", function () {
        expect(tb).toBeDefined();
        expect(tb).not.toBe(null);
    });

});

