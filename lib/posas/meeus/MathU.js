/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * MathU
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


var mathU = {

    // Splits a number of seconds into hour, minute, seconds
    // @param {num} Integer - number of seconds
    // @return Object - A sign plus hours, minutes, seconds
    // @api : private
    sec2hhmmss : function (sec) {

        var reminder = abs(sec) % 3600;  // remaining seconds of the uncomplete hour

        return {
            sign : sec >= 0 ? 1 : -1,
            hh : floor(abs(sec) / 3600),
            mm : floor(reminder / 60),
            ss : reminder % 60
        };

    },

    deg2hhmmss : function (deg) {
        return mathU.sec2hhmmss(deg * SEC_PER_DEGREE);
    },

    /**
     * Konvertiert hh:mm:ss nach 0,xxx..
     * @param hh - Stunden
     * @param mm - Minuten
     * @param ss - Sekunden
     * @return Nachkomma-Stellen für Julian Date
     */
    hhmmss2dec : function (hh, mm, ss) {
        return hh / 24.0 + mm / 1440.0 + ss / 86400.0;
    },

    /**
     * Konvertiert Kalender-Datum nach Julian Date
     *
     * @param yy - Jahr
     * @param mm - Monat
     * @param dd - Tag zuzüglich Anzahl Stunden in Decimal-Foramt e.g. dd=0.5 für 12Uhr Mittags
     * @return Anzahl Tage seit 4716 vor Christus
     *
     * @see : MEEUS, Astronomical Algorithms, p62
     */
    julianDay : function (yy, mm, dd) {

        var Y,
            M,
            D = dd,
            A,
            B;

        if (mm > 2) {
            Y = yy;
            M = mm;
        } else {
            // "..., if the date is in January or Febrary, it is considered
            // to be the 13th or 14th month of the previos year."
            // MEEUS, Astronomical Algorithms, p62
            Y = yy - 1;
            M = mm + 12;
        }

        A = ~~(Y / 100);
        B = 2 - A + ~~(A / 4); // In the Gregorian Calendar, calculate B
                               // In the Julian Calendar, take B = 0

        return (~~(365.25 * (Y + 4716)))
            + (~~(30.6001 * (M + 1)))
            + D
            + B
            - 1524.5;

    },


    //
    //
    //
    julianDayA : function (yy, mm, dd, hh, min, ss) {
        return mathU.julianDay(yy, mm, dd + mathU.hhmmss2dec(hh, min, ss));
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

module.exports = mathU;


