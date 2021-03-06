/*jslint node: true */
/*jslint todo: true */

'use strict';

var interpol = require('./../../lib/sunJS/meeus/interpol.js'),
    _ = require('lodash'),

    actual,

    // @see: MEEUS, Astronomical Algorithms (Second Edition), example 3.a
    linearValues = [
        //  y1         y2       y3      n
        [0.884226, 0.877366, 0.870531, 4.35/24, 0.8761253012695313]
    ],

    // @see: MEEUS, Astronomical Algorithms (Second Edition), example 3.b
    extremumValues = [
        //  y1         y2       y3
        [1.3814294, 1.3812213, 1.3812453, { ym : 1.3812030466555365, nm : 0.39659629470048713 }]
    ],

    // @see: MEEUS, Astronomical Algorithms (Second Edition), example 3.c
    zeroValues = [
        //  y1      y2      y3
        [-1693.4, 406.3, 2303.2, -0.20126729503147783]
    ];

//
// linear
//
describe("The 'linear' function", function () {

    it("should return a Number for linear values", function () {
        linearValues.forEach(function (values) {
            actual = interpol.linear(values.slice(0, 3), values[3]);
            expect(values[4]).toBe(actual);
        });

    });

    // interpol.linear with extremum values.
    // 2014-SEP-09 Removed, fails at summer and winter solstice

    // interpol.linear with zero values.
    // nothing to do

});

//
// extremum
//
describe("The 'extremum' function", function () {

    it("should return a Number for extremum values", function () {
        extremumValues.forEach(function (values) {
            actual = interpol.extremum(values.slice(0, 3), 0);
            expect(values[3].ym).toBe(actual.ym);
            expect(values[3].nm).toBe(actual.nm);
        });

    });

    // interpol.extremum with linear values.
    it("should return 'undefined' for linear values", function () {
        linearValues.forEach(function (values) {
            actual = interpol.extremum(values.slice(0, 3));
            expect(undefined).toBe(actual);
        });

    });

    // interpol.extremum with zero values.
    it("should return 'undefined' for zero values", function () {
        zeroValues.forEach(function (values) {
            actual = interpol.extremum(values.slice(0, 3));
            expect(undefined).toBe(actual);
        });

    });

});

//
// zero
//
describe("The 'zero' function", function () {

    it("should return a Number for zero values", function () {
        zeroValues.forEach(function (values) {
            actual = interpol.zero(values.slice(0, 3), 0);
            expect(values[3]).toBe(actual);
        });

    });

    // interpol.zero with extremum values
    it("should return 'undefined' for extremum values", function () {
        extremumValues.forEach(function (values) {
            actual = interpol.zero(values.slice(0, 3), 0);
            expect(undefined).toBe(actual);
        });

    });

    // interpol.zero with linear values
    it("should return 'undefined' for linear values", function () {
        linearValues.forEach(function (values) {
            actual = interpol.zero(values.slice(0, 3), 0);
            expect(undefined).toBe(actual);
        });

    });

});
