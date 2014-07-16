/*jslint node: true */
/*jslint todo: true */

var MathEx = require('../lib/posas/util/MathEx.js'),
    moment = require('moment'),
    timebase = require('../lib/posas/timebase.js'),
    af = require('../lib/posas/angleFormatter.js'),
    tb = timebase(),
    up,
    x,
    y;




up = tb.update();

x = up.gmst0 * 240;

console.log(af.formatTime(MathEx.deg2Hhmmss(up.gmst0)  , 1));

describe("timebase", function () {


    it("shouldn't be null or undefined", function () {
        expect(tb).toBeDefined();
        expect(tb).not.toBe(null);
    });

});

