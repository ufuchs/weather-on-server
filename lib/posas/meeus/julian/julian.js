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

var julian = {};

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


//
// @param {jd} Number - Julian Day
//
julian.jdAtMidnight = function(jd) {

    var  k = (jd - ~~jd) < 0.5
            // Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
            // was die Julian Date Number um eins erhöht hat.
            // Dies ist per Subtraktion zu korrigieren.
            ? 1.0
            : 0;

    return Math.floor(jd - k) + 0.5;

};

module.exports = julian;


//console.log(julianDay.calc(2014, 7, 12.5));

// ΔT = 62.92 + 0.32217 * t + 0.005589 * t^2
//    where: t = y - 2000

/*
var
  yy = 2005,
  t,
  ΔT,
  korr;

t = (yy -2000);

ΔT = 62.92 + (0.32217 * t) + (0.005589 * t * t);

korr = 0.37 * (2000 - 2100);

console.log(t, ΔT, korr, ΔT + korr);
*/