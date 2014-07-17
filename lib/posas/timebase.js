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

var MathU = require('./util/MathU.js');

(function () {

    'use strict';

    var timeBase,

        DAYS_PER_CENTURY = 36525.0,
        JD_CORR_TO_2000 = 2451545.0,
        HOURS_PER_DAY = 24;


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

        return MathU.normalizeAngle(result, 360.0);

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
            k;

        ///////////////////////////////
        // update 'jd'
        //////////////////////////////

        ut = MathU.hhmmss2dec(hh, min, ss);

        jd = MathU.julianDay(yy, mm, dd + ut);

        ///////////////////////////////
        // update 'jd0'
        //////////////////////////////

        k = (jd - ~~jd) < 0.5
            // Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
            // was die Julian Date Number um eins erhöht hat.
            // Dies ist per Subtraktion zu korrigieren.
            ? 1.0
            : 0;

        jd0 = Math.floor(jd - k) + 0.5;

        ///////////////////////////////
        // update 'jd2k'
        //////////////////////////////

        jd2k = jd - JD_CORR_TO_2000;

        ///////////////////////////////
        // update 'jd2k0'
        //////////////////////////////

        jd2k0 = jd0 - JD_CORR_TO_2000;

        return {
            jd : jd,
            jd0 : jd0,
            jd2k : jd2k,
            jd2k0 : jd2k0,
            gmst : computeGmst(jd2k0, jd),
            gmst0 : computeGmst(jd2k0, jd0)
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

    TimeBase.prototype.update = function (dt) {

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
