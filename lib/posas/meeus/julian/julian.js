/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * julianDay
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Don't go around saying the world owes you a living. The world owes you ]
 * [ nothing. It was here first.                              - Mark Twain -]
 */

'use strict';

var julian = {},

    // Julian and Besselian years described in chapter 21, Precession.
    // T, Julian centuries since J2000 described in chapter 22, Nutation.

    J2000 = 2451545.0,  // Julian Day number corresponding to January 1.5 year 2000.
    JCENTURY = 36525;   // in days

// Konvertiert Kalender-Datum nach Julian Day
//
// @param {yy} Integer - Jahr
// @param {mm} Integer - Monat
// @param {dd} Number  - Tag zuzüglich Anzahl Stunden in Decimal-Foramt e.g. dd=0.5 für 12Uhr Mittags
// @return Number      - Anzahl Tage seit 4716 vor Christus
//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 61

julian.calendarGregorianToJd = function (yy, mm, dd) {

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

    // (7.1) p. 61
    return (~~(365.25 * (Y + 4716)))
        + (~~(30.6001 * (M + 1)))
        + D
        + B
        - 1524.5;

};

//
//
//
julian.calendarGregorianToJdA = function (yy, mm, dd, hour, min, sec) {

    /**
     * Konvertiert hh:mm:ss nach 0,xxx..
     * @param hh - Stunden
     * @param mm - Minuten
     * @param ss - Sekunden
     * @return Nachkomma-Stellen für Julian Date
     */
    function hhmmss2dec (hour, min, sec) {
        return hour / 24.0 + min / 1440.0 + sec / 86400.0;
    }

    dd += hhmmss2dec(hour, min, sec);

    return julian.calendarGregorianToJd(yy, mm, dd);

};

// returns the number of Julian centuries since J2000.
//
// The quantity appears as T in a number of time series.
julian.j2000Century = function(jd) {

    // Calculates the Julian Day at 00:00 of any given Julian Day value between
    // a human calendar day.
    // @param {jd} Number - (jd + .5) < x < (jd + 1) + 0.49999999999
    // @result Number = Julian Day number at 00:00 of the current calendar day
    function jdAtMidnight (jd) {

        var f = (jd - ~~jd),
            k = f < 0.5
            // Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
            // was die Julian Date Number um eins erhöht hat.
            // Dies ist per Subtraktion zu korrigieren.
            ? 1.0
            : 0;

        return Math.floor(jd - k) + 0.5; // 00:00 of the current day in calendar

    }

    // The formula is given in a number of places in the book, for example
    // (12.1) p. 87.
    // (22.1) p. 143.
    // (25.1) p. 163.
    return (jdAtMidnight(jd) - J2000) / JCENTURY;

};


module.exports = julian;
