/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * MathEx
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

'use strict';

var

    TWOPI = Math.PI + Math.PI,
    RAD2DEG = 180.0 / Math.PI,
    RAD2SEC = 180.0 * 3600.0 / Math.PI,
    DEG2RAD = Math.PI / 180.0,
    SEC_PER_DEGREE = 240.0,

    DEGREE = 0,

    floor = Math.floor,
    abs = Math.abs;


/*
function int(a) {
    return ~~a;
}

//
//
//
function frac(a) {
    return a - int(a);
}

//
//
//
function floorDiv(a, b) {

    a = int(a);
    b = int(b);

    return a >= 0
        ? int(a / b)
        : int(-((-a + b - 1) / b));

}

//
//
//
function floorMod(a, b) {

    a = int(a);
    b = int(b);

    return a >= 0
        ? int(a % b)
        : int(a + int(((-a + b - 1) / b)) * b);

}



function interpol(values, n) {

    y2 = values[1];
    a = y2 - values[0];
    b = values[2] - y2;

    return y2 + (n / 2.0) * (a + b + n * (b - a));

}

*/

//
// maybe obsolete under Javascript
//
function fmod(a, n) {

    var f;

    if (n !== 0.0) {

        // return f such that x = i * y + f for some integer i
        //   such that |f| < |y| and f has the same sign as x

        f = a - n * Math.floor(a / n);

        if ((a < 0.0) !== (n < 0.0)) {
            f = f - n;
        }

    } else {

        f = 0.0;

    }

    return f;

}

// Splits a number of seconds into hour, minute, seconds
// @param {num} Integer - number of seconds
// @return Object - A sign plus hours, minutes, seconds
// @api : private
function sec2hhmmss(sec) {

    var reminder = abs(sec) % 3600;  // remaining seconds of the uncomplete hour

    return {
        sign : sec >= 0 ? 1 : -1,
        hh : floor(abs(sec) / 3600),
        mm : floor(reminder / 60),
        ss : reminder % 60
    };

}


var mathex = {

    deg2Hhmmss : function (deg) {
        return sec2hhmmss(deg * SEC_PER_DEGREE);
    },

    normalizeAngle : function (angle, base) {

        /*
        var result = fmod(angle, base);

        if (result < 0.0) {
            result += base;
        }

        return result;
        */

        return angle % base;

    },

    interpol : function (values, n) {

        var y2 = values[1],
            a = y2 - values[0],
            b = values[2] - y2;

        return y2 + (n / 2.0) * (a + b + n * (b - a));

    }

};

module.exports = mathex;


