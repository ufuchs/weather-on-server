/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * Timebase
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */


(function () {

    'use strict';

    var timeBase,
        DAYS_PER_CENTURY = 36525.0,
        JD_CORR_TO_2000 = 2451545.0,
        jd2k0;

   /**
    * MEEUS, (12.4)
    * @param jd
    * @return
    */
   function computeGmstFormal(jd) {

        var T = jd2k0 / DAYS_PER_CENTURY,
            C1 = 280.46061837,
            C2 = 360.98564736629,
            C3 = 0.000387933,
            C4 = 1 / 38710000.0,
            result = C1 + C2 * (jd - JD_CORR_TO_2000) + T * (0 + T * (C3 - T * C4));

        return MathEx.normalizeAngle(result, 360.0);

   }


    /**
     * Konvertiert Kalender-Datum nach Julian Date
     * @param yy - Jahr
     * @param mm - Monat
     * @param dd - Tag zuzüglich Anzahl Stunden in Decimal-Foramt e.g. dd=0.5 für 12Uhr Mittags
     * @return Anzahl Tage seit 4716 vor Christus
     */
    function julianDay(yy, mm, dd) {

        var Y,
            M,
            D = dd,
            B = -13;

        if (mm > 2) {
            Y = yy;
            M = mm;
        } else {
            Y = yy - 1;
            M = mm + 12;
        }

        // Konstante für Zeitspanne von 1900-03-01 bis 2100-02-28
        // nach MEEUS, Astronomical Algorithms, p62

        return (~~(365.25 * (Y + 4716)))
            + (~~(30.6001 * (M + 1)))
            + D
            + B
            - 1524.5;

    }

    /**
     * Konvertiert hh:mm:ss nach 0,xxx..
     * @param hh - Stunden
     * @param mm - Minuten
     * @param ss - Sekunden
     * @return Nachkomma-Stellen für Julian Date
     */
    function hhmmss2Dec(hh, mm, ss) {

        return hh/24.0 + mm/1440.0 + ss/86400.0;

    }


    // /////////////////////////////////////////////////////////////////////////
    // Constructors
    // /////////////////////////////////////////////////////////////////////////

    function TimeBase () {}

    // /////////////////////////////////////////////////////////////////////////
    // Astro Prototype
    // /////////////////////////////////////////////////////////////////////////

    TimeBase.prototype = {


       public double computeGmst() {
           return computeGmstFormal(jd);
       }

        /**
         * Mitternacht
         *
         */
        public double computeGmst0() {
            return computeGmstFormal(jd0);
        }



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
