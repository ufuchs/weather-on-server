/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * base
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * Partial Copyright 2013 Sonia Keys
 * MIT Licensed
 *
 */

var _ = require('lodash'),

    abs = Math.abs,

    interpol = {};

//
// interpolExtremum
//
interpol.extremum = function (values) {

    // values[1] is expected to be the max or the min value in the sequence
    if (!(values[0] < values[1] && values[1] > values[2]) &&
        !(values[0] > values[1] && values[1] < values[2])) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a,
        nm = - (a + b) / (2*c);

    // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
    if (abs(nm) > 1.0) {
        throw "interpol.extremum: param 'n' is greather +/-1";
    }

    return {
        ym : y2 - (a*a + 2*a*b + b*b) / (8*c),
        nm : nm
    };

};

//
// interpolZero
// @see: MEEUS, Astronomical Algorithms (Second Edition), (3.6)
interpol.zero = function (values, n0) {

    if (n0 === undefined) {
        throw "interpol.zero: missing param 'n0'";
    }

    // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
    if (abs(n0) > 1.0) {
        throw "interpol.zero: param 'n0' is greather +/-1";
    }

    var asc = (values[0] > 0 && 0 > values[2]) &&
            (values[0] > values[1] && values[1] > values[2]),
        desc = (values[0] < 0 && 0 < values[2]) &&
            (values[0] < values[1] && values[1] < values[2]);

    if (!asc && !desc) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    // returns a __new__ value of 'n0'
    return (-2 * y2) / (a + b + c*n0);
};

//
// zeroA
// @see: MEEUS, Astronomical Algorithms (Second Edition), (3.7)
interpol.zeroA = function (values, n0) {

    if (n0 === undefined) {
        throw "interpol.zeroA: missing param 'n0'";
    }

    var asc = (values[0] > 0 && 0 > values[2]) &&
            (values[0] > values[1] && values[1] > values[2]),
        desc = (values[0] < 0 && 0 < values[2]) &&
            (values[0] < values[1] && values[1] < values[2]);

    if (!asc && !desc) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    function calcN0 (n0) {

        // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
        if (abs(n0) > 1.0) {
            throw "interpol.zeroA: param 'n0' is greather +/-1";
        }

        return -(2 * y2 + n0 * (a + b + c * n0)) /
            (a + b + 2 * c * n0);
    }

    // returns a delta of 'n0'
    return calcN0(n0);
};


//
// interpolLinear
//
interpol.linear = function (values, n) {

    if (n === undefined) {
        throw "interpol.linear: missing param 'n'";
    }

    // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
    if (abs(n) > 1.0) {
        throw "interpol.linear: param 'n' is greather +/-1";
    }

    // values[1] is expected to be the max or the min value in the sequence
    if (!(values[0] < values[1] && values[1] < values[2]) &&
        !(values[0] > values[1] && values[1] > values[2])) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    return y2 + (n / 2.0) * (a + b + n * c);
};

module.exports = interpol;
