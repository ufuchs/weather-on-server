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

x = (360 * 0.81) % 360;

console.log(af.formatTime(MathU.deg2hhmmss(x)  , 1));

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
            [1600, 1, 1.0, 2305447.5],
            [1957, 10, 4.81, 2436116.31],  // launch time of Sputnik One
        ];

        dates.forEach(function (item) {
            actual = (MathU.julianDay.apply(this, item.slice(0, 3)));
            expect(item[3]).toBe(actual);
        });

    });

    it("should calculate the hour, min, sec of a day into a range between 0 =< x < 1 ", function () {

        var actual,
            hours = [
            [0, 0, 0, 0],    // midnight
            [12, 0, 0, 0.5]  // noon
        ];

        hours.forEach(function (item) {
            actual = (MathU.hhmmss2dec.apply(this, item.slice(0, 3)));
            expect(item[3]).toBe(actual);
        });

    });


    it("should calculate a JD by a Gregorian Calender date and with the day time", function () {

        var actual,
            dates = [
                // @see: MEEUS, Astronomical Algorithms (Second Edition), p62
                [2014, 7, 17, 0, 0, 0, 2456855.5],     // midnight
                [2000, 1, 1, 12, 0, 0,  2451545.0],    // noon
                [1957, 10, 4, 19, 26, 24, 2436116.31], // launch time of Sputnik One
            ];

        dates.forEach(function (item) {
            actual = (MathU.julianDayA.apply(this, item.slice(0, 6)));
            expect(item[6]).toBe(actual);
        });

    });


    it("should calculate ", function () {

        var actual,
            deg = [
                [0, { sign : 1, hh : 0, mm : 0, ss : 0 }],    // midnight
                [180, { sign : 1, hh : 12, mm : 0, ss : 0 }]  // noon
            ];

        deg.forEach(function (item) {
            actual = (MathU.deg2hhmmss.apply(this, item.slice(0)));
            expect(item[1]).toBe(actual);
        });

    });



});

