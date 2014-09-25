/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var deltaT = require('./../../lib/sunJS/meeus/deltat.js');

describe("Calcultes ΔT", function () {

    it("for year 2005/Nasa", function () {

        var actual = deltaT.poly2005to2050Nasa(2005),
            expected = 64.670575;

        expect(expected).toBe(actual);

    });

    it("for years 2005/Meeus", function () {

        var actual = deltaT.polyAfter2000Meeus(2005),
            expected = 72.01325;

        expect(expected).toBe(actual);

    });

    it("for year 2010/Nasa", function () {

        var actual = deltaT.poly2005to2050Nasa(2010),
            expected = 66.70060000000001;

        expect(expected).toBe(actual);

    });

    it("for years 2010/Meeus", function () {

        var actual = deltaT.polyAfter2000Meeus(2010),
            expected = 79.153;

        expect(expected).toBe(actual);

    });

});

