/*jslint node: true */
/*jslint todo: true */

var MathU = require('../lib/posas/util/MathU.js'),
    moment = require('moment'),
    timebase = require('../lib/posas/timebase.js'),
    af = require('../lib/posas/util/Formatter.js'),
    tb = timebase(),
    up,
    x,
    y;




up = tb.update(new Date());

x = up.gmst0 * 240;

console.log(af.formatTime(MathU.deg2hhmmss(up.gmst0)  , 1));

describe("timebase", function () {

    it("shouldn't be null or undefined", function () {
        expect(tb).toBeDefined();
        expect(tb).not.toBe(null);
    });

    it("should calculate a JD by a Gregorian Calender date", function () {

        var actual,
            dates = [
            // @see: MEEUS, Astronomical Algorithms (Second Edition), p62
            [2014, 7, 17.0, 2456855.5],
            [2000, 1, 1.5, 2451545.0],
            [1999, 1, 1.0, 2451179.5],
            [1987, 1, 27.0, 2446822.5],
            [1900, 1, 1.0, 2415020.5],
            [1600, 1, 1.0, 2305447.5]
        ];

        dates.forEach(function (item) {
            actual = (MathU.julianDay.apply(this, item.slice(0, 3)));
            expect(item[3]).toBe(actual);
        });

    });

    it("should calculate a JD by a Gregorian Calender date", function () {

        var actual,
            dates = [
            // @see: MEEUS, Astronomical Algorithms (Second Edition), p62
            [2014, 7, 17.0, 2456855.5],
            [2000, 1, 1.5, 2451545.0],
            [1999, 1, 1.0, 2451179.5],
            [1987, 1, 27.0, 2446822.5],
            [1900, 1, 1.0, 2415020.5],
            [1600, 1, 1.0, 2305447.5]
        ];

        dates.forEach(function (item) {
            actual = (MathU.julianDay.apply(this, item.slice(0, 3)));
            expect(item[3]).toBe(actual);
        });

    });





});

