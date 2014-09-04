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
        c = b - a;

    return {
        ym : y2 - (a*a + 2*a*b + b*b) / (8*c),
        nm : - (a + b) / (2*c)
    };

};

//
// interpolZero
//
interpol.zero = function (values, n0) {

    if (n0 === undefined) {
        throw "interpol.zero: missing param 'n0'";
    }

    var asc = (values[0] > 0 && 0 > values[2]) &&
        (values[0] > values[1] && values[1] > values[2]);

    var desc = (values[0] < 0 && 0 < values[2]) &&
        (values[0] < values[1] && values[1] < values[2]);

    if (!asc && !desc) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    return (-2 * y2) / (a + b + c*n0);
};

//
// interpolLinear
//
interpol.linear = function (values, n) {

    if (n === undefined) {
        throw "interpol.linear: missing param 'n'";
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
