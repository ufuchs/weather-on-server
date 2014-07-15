/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * Timebase
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Don't go around saying the world owes you a living. The world owes you ]
 * [ nothing. It was here first.                              - Mark Twain -]
 */

var MathEx = require('./util/MathEx.js');

(function () {

    'use strict';

    var timeBase,

        DAYS_PER_CENTURY = 36525.0,
        JD_CORR_TO_2000 = 2451545.0,
        HOURS_PER_DAY = 24;

    /**
     * Konvertiert hh:mm:ss nach 0,xxx..
     * @param hh - Stunden
     * @param mm - Minuten
     * @param ss - Sekunden
     * @return Nachkomma-Stellen für Julian Date
     */
    function hhmmss2Dec(hh, mm, ss) {
        return hh / 24.0 + mm / 1440.0 + ss / 86400.0;
    }

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
    function julianDay(yy, mm, dd) {

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

    }

   /**
    * MEEUS, (12.4)
    * @param jd
    * @return
    */
    function computeGmst(jd2k0, jd) {

        var T = jd2k0 / DAYS_PER_CENTURY,
            C1 = 280.46061837,
            C2 = 360.98564736629,
            C3 = 0.000387933,
            C4 = 1 / 38710000.0,
            result = C1 + C2 * (jd - JD_CORR_TO_2000) + T * (0 + T * (C3 - T * C4));

        return MathEx.normalizeAngle(result, 360.0);

    }

   /**
    *
    * @param {yy} Integer
    * @param {mm} Integer
    * @param {dd} Integer
    * @param {hh}  Integer
    * @param {min} Integer
    * @param {ss} Integer
    */
    function update(yy, mm, dd, hh, min, ss) {

        var ut = 0,
            jd = 0,

            jd0  = 0,
            jd2k = 0,
            jd2k0 = 0,

            gmst0 = 0,  // Siderial time at Greenwich at 0:00h
            gmst = 0,   // at any given time
            k = 0;

        ///////////////////////////////
        // update 'jd'
        //////////////////////////////

        ut = hhmmss2Dec(hh, min, ss);

        jd = julianDay(yy, mm, dd + ut);

        ///////////////////////////////
        // update 'jd0'
        //////////////////////////////

        if ((jd - ~~jd) < 0.5) {
            // Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
            // was die Julian Date Number um eins erhöht hat.
            // Dies ist per Subtraktion zu korrigieren.
            k = 1.0;
        }

        jd0 = Math.floor(jd - k) + 0.5;

        ///////////////////////////////
        // update 'jd2k'
        //////////////////////////////

        jd2k = jd - JD_CORR_TO_2000;

        ///////////////////////////////
        // update 'jd2k0'
        //////////////////////////////

        jd2k0 = jd0 - JD_CORR_TO_2000;

        ///////////////////////////////
        // update 'gmst'
        //////////////////////////////

        gmst = computeGmst(jd2k0, jd);

        ///////////////////////////////
        // update 'gmst0'
        //////////////////////////////

        gmst0 = computeGmst(jd2k0, jd0);

        return {
            jd : jd,
            jd0 : jd0,
            jd2k : jd2k,
            jd2k0 : jd2k0,
            gmst : gmst,
            gmst0 : gmst0
        };

    }

    // /////////////////////////////////////////////////////////////////////////
    // Constructors
    // /////////////////////////////////////////////////////////////////////////

    function TimeBase () {
    }

    // /////////////////////////////////////////////////////////////////////////
    // Astro Prototype
    // /////////////////////////////////////////////////////////////////////////

    TimeBase.prototype.update = function () {

        var dt = new Date();

        return update(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(),
            dt.getHours(), dt.getMinutes(), dt.getSeconds());

    };

    timeBase = function () {
        return new TimeBase();
    };


    /**
     * Expose `timeBase`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = timeBase;
    }

}());
