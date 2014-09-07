/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * interpol
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Obstacles are those frightful things you see when you take your eyes off ]
 * [ your goal.                                                - Henry Ford - ]
 */

var _ = require('lodash'),

    abs = Math.abs,

    interpol = {};

//
// calcDiffs
//
function calcDiffs (values) {

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    return [y2, a, b, c];

}

//
// linear
//
interpol.linear = function (values, n) {

    function prepare (values, n) {

        var preparedValues = calcDiffs(values);

        preparedValues.push(n);

        return preparedValues;

    }

    function checkPreRequest (values, n) {

        var res = 0,
            asc,
            desc;

        if (n === undefined) {
            res = 1;
        }

        // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
        if (abs(n) > 1.0) {
            res = 2;
        }

        asc = (values[0] < values[1] && values[1] < values[2]);
        desc = (values[0] > values[1] && values[1] > values[2]);

        if (!asc &&  !desc) {
            res = 3;
        }

        switch (res) {
            case 1 : throw "interpol.linear: missing param 'n'";
            case 2 : throw "interpol.linear: param 'n' is greather +/- 1.0";
            case 3 : return undefined;
        }

        return [values, n];

    }

    //
    // calc
    //
    function calc (y2, a, b, c, n) {
        return y2 + (n / 2.0) * (a + b + n * c);
    }

    var checkedPreRequest = checkPreRequest(values, n),
        prePared;

    if (checkedPreRequest !== undefined) {
        prePared = prepare.apply(this, checkedPreRequest);
        return calc.apply(this, prePared);
    } else {
        return undefined;
    }

};

//
// extremum
//
interpol.extremum = function (values) {

    function checkPreRequest (values) {

        // values[1] is expected to be the max or the min value in the sequence
        if (!(values[0] < values[1] && values[1] > values[2]) &&
            !(values[0] > values[1] && values[1] < values[2])) {
            return undefined;
        }

        return [values];

    }

    function calc (y2, a, b, c) {
        return {
            ym : y2 - (a*a + 2*a*b + b*b) / (8*c),
            nm : nm = - (a + b) / (2*c)
        };
    }

    function checkPostRequest (result) {

        // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
        if (abs(nm) > 1.0) {
            throw "interpol.extremum: param 'n' is greather +/- 1.0";
        }

        return result;
    }

    var checkedPreRequest = checkPreRequest(values),
        prePared;

    if (checkedPreRequest !== undefined) {
        prePared = calcDiffs.apply(this, checkedPreRequest);
        return checkPostRequest(calc.apply(this, prePared));
    } else {
        return undefined;
    }

};

//
// zero
// @see: MEEUS, Astronomical Algorithms (Second Edition), (3.7)
interpol.zero = function (values) {

    function checkPreRequest (values) {

        var asc = (values[0] > 0 && 0 > values[2]) &&
                (values[0] > values[1] && values[1] > values[2]),
            desc = (values[0] < 0 && 0 < values[2]) &&
                (values[0] < values[1] && values[1] < values[2]);

        if (!asc && !desc) {
            return undefined;
        }

        return [values];

    }

    var calc = function calc(y2, a, b, c, n0, i) {

        n0 = n0 || 0;

        i = i || 6; // 6 recursions

        if (i === 1) {
            return n0;
        }

        // @see: MEEUS, Astronomical Algorithms (Second Edition), (3.7)
        n0 += -(2 * y2 + n0 * (a + b + c * n0)) /
            (a + b + 2 * c * n0);

        // @see: MEEUS, Astronomical Algorithms (Second Edition), p. 31
        if (abs(n0) > 1.0) {
            throw "interpol.zeroA: param 'n0' is greather +/- 1.0";
        }

        return calc(y2, a, b, c, n0, i - 1);

    };

    var checkedPreRequest = checkPreRequest(values),
        prePared;

    if (checkedPreRequest !== undefined) {
        prePared = calcDiffs.apply(this, checkedPreRequest);
        return calc.apply(this, prePared);
    } else {
        return undefined;
    }

};


module.exports = interpol;
