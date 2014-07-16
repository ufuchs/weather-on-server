/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * angleFormatter
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ If we did all the things we are capable of, we would literally astound ]
 * [ ourselves.                                         - Thomas A. Edison -]
 */

var MathEx = require('./util/MathEx.js');

(function () {

    'use strict';

    var hemiLat = ['N', 'S'],
        hemiLon = ['W', 'E'],
        // modes of 'angle2Ddmm'
        WITH_SIGN = 1,
        HEMI_LON = 2,
        HEMI_LAT = 4,
        HEMI_ALL = HEMI_LON + HEMI_LAT,
        DELI_SPACE = 8,
        // modes of 'angle2Time'
        TIME_ANALOG = 1,
        TIME_DIGITAL = 2,

        angleFormatter = {

            /**
             * Formatiert einen Winkel <code>angle</code> in Abhängigkeit von
             * <code>mode</code> ins Zeit-Format.
             * <p>
             * Anwendung bei der Darstellung im UI.
             * <p>
             *
             * @param angle
             *            Winkel in DEG
             * @return Zeitangabe, z.B. "12h 23m 45s" || "12:24"
             */
            formatTime : function (hhmmss, mode) {

                //  TODO Zusammenfassen mit angle2Time_Hhmm_Digital
                var hour = hhmmss.hh,

                    min = hhmmss.mm,

                    sec = hhmmss.ss.toFixed(1),

                    result = "";

                    console.log(hhmmss, '--------------------');

                if (hour < 10) {
                    result += "0";
                }
                result += hour;

                switch (mode) {

                case TIME_ANALOG:
                    result += "h ";
                    break;

                case TIME_DIGITAL:
                    result += ":";
                    break;

                }

                if (min < 10) {
                    result += "0";
                }
                result += min;


                switch (mode) {

                case TIME_ANALOG:

                    result += "m ";

                    if (sec < 10) {
                        result += "0";
                    }
                    result += sec;

                    result += "s";

                    break;

                case TIME_DIGITAL:
                    result += ":";
                    break;

                }

                return result;

            }

    };


    /**
     * Expose `timeBase`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = angleFormatter;
    }

}());








