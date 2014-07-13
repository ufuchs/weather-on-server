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

var

    TWOPI = Math.PI + Math.PI,
    RAD2DEG = 180.0 / Math.PI,
    RAD2SEC = 180.0 * 3600.0 / Math.PI,
    DEG2RAD = Math.PI / 180.0,
    SEC_PER_DEGREE = 240.0;

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

//
//
//
function fmod(a, n) {

    var f;

    if (n !== 0.0) {

        /* return f such that x = i * y + f for some integer i
           such that |f| < |y| and f has the same sign as x */

        f = a - n * Math.floor(a / n);

        if ((a < 0.0) !== (n < 0.0)) {
            f = f - n;
        }

    } else {

        f = 0.0;

    }

    return f;

}




// console.log(frac(2.3));
// console.log(floorDiv(7, -2));


console.log(floorMod(4, -3));
console.log(floorMod(-4, 3));
console.log(floorMod(-4, -3));

