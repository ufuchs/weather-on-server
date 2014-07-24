/*jslint node: true */
/*jslint todo: true */

'use strict';

var julian = require('./../../lib/posas/meeus/julian/julian.js');


describe("A given date by by year, month and day AND hours as decimal places", function () {

    // julian.calendarGregorianToJD
    it("returns a Julian Day number", function () {

        var actual,
            dates = [
            // the time of the day is coded as decimal places
            // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 62
            // year, month, day, expected JD
            [2014, 7, 17.0, 2456855.5],
            [2000, 1, 1.5, 2451545.0],
            [1999, 1, 1.0, 2451179.5],
            [1987, 1, 27.0, 2446822.5],
            [1900, 1, 1.0, 2415020.5],
            [1600, 1, 1.0, 2305447.5],
            [1957, 10, 4.81, 2436116.31],  // launch time of Sputnik One
        ];

        dates.forEach(function (item) {
            actual = (julian.calendarGregorianToJd.apply(this, item.slice(0, 3)));
            expect(item[3]).toBe(actual);
        });

    });

});

describe("A given date by by year, month, day, hours, min and sec", function () {

    it("returns a Julian Day number", function () {

        var actual,
            dates = [
                // @see: MEEUS, Astronomical Algorithms (Second Edition), p62
                // year, month, day, hour, min, sec, expected JD
                [2014, 7, 17, 0, 0, 0, 2456855.5],     // midnight
                [2000, 1, 1, 12, 0, 0,  2451545.0],    // noon
                [1957, 10, 4, 19, 26, 24, 2436116.31], // launch time of Sputnik One
//                [1969, 7, 20, 20, 17, 35, 2440423.3455903], // Apollo 11 moon landing
            ];

        dates.forEach(function (item) {
            actual = (julian.calendarGregorianToJdA.apply(this, item.slice(0, 6)));
            expect(item[6]).toBe(actual);
        });

    });

});

describe("Century since J2K", function () {

    var jd_of_1987_Apr_10 = 2446895.5,
        centuryAtMidnight = -0.12729637234770705;


    // Meeus, p. 88, example 12.a
    it("returns a value of -0.127296372347... by 1987 April 10 00:00:00.0 UT", function () {

        var actual = julian.j2000Century(jd_of_1987_Apr_10);

        expect(centuryAtMidnight).toBe(actual);

    });

    // Meeus, p. 89, examole 12.b
    it("returns a value of -0.127296372347... by 1987 April 10 19:21", function () {

        var at_19h21min = 0.80625,
            actual = julian.j2000Century(jd_of_1987_Apr_10 + at_19h21min);

        expect(centuryAtMidnight).toBe(actual);

    });


});

// console.log(julian.toDays(new Date()));

