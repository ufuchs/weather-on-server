/*jslint node: true */
/*jslint todo: true */

'use strict';

var interpol = require('./../../lib/sunJS/meeus/interpol.js'),
    _ = require('lodash'),

    actual,

    linearValues = [
        [0.3, 0.2, 0.1, 0.2],
        [0.1, 0.2, 0.3, 0.2]
    ],

    zeroValues = [
        [0.3, 0.1, -0.2, 0.4],
        [-0.2, 0.1, 0.3, -0.4]
    ],

    extremumValues = [
        [0.1, 0.3, -0.2, { ym : 0.31607142857142856, nm : -0.21428571428571433 }],
        [-0.2, 0.3, 0.1, { ym : 0.31607142857142856, nm : 0.21428571428571433 } ]
    ];


describe("The 'zero' function", function () {

    // interpol.zero
    it("should return a Number", function () {
        zeroValues.forEach(function (values) {
            actual = interpol.zero(values.slice(0, 3), 0);
            expect(values[3]).toBe(actual);
        });

    });

    // interpol.zero with inappropriate values
    // should return 'undefined'
    it("should return 'undefined'", function () {
        extremumValues.forEach(function (values) {
            actual = interpol.zero(values.slice(0, 3), 0);
            expect(undefined).toBe(actual);
        });

    });

});

describe("The 'extremum' function", function () {

    // interpol.extremum
    it("should return a Number", function () {
        extremumValues.forEach(function (values) {
            actual = interpol.extremum(values.slice(0, 3), 0);
            expect(values[3].ym).toBe(actual.ym);
            expect(values[3].nm).toBe(actual.nm);
        });

    });

    // interpol.extremum with inappropriate values.
    // should return 'undefined'
    it("should return 'undefined'", function () {
        zeroValues.forEach(function (values) {
            actual = interpol.extremum(values.slice(0, 3));
            expect(undefined).toBe(actual);
        });

    });

});

describe("The 'linear' function", function () {

    // interpol.linear
    it("should return a Number", function () {
        linearValues.forEach(function (values) {
            actual = interpol.linear(values.slice(0, 3), 0);
            expect(values[3]).toBe(actual);
        });

    });

    // interpol.extremum with inappropriate values.
    // should return 'undefined'
    it("should return 'undefined'", function () {
        extremumValues.forEach(function (values) {
            actual = interpol.linear(values.slice(0, 3), 0);
            expect(undefined).toBe(actual);
        });

    });

    // interpol.zero with inappropriate values
    // should return 'undefined'
    it("should return 'undefined'", function () {
        zeroValues.forEach(function (values) {
            actual = interpol.linear(values.slice(0, 3), 0);
            expect(undefined).toBe(actual);
        });

    });

});
