/*jslint node: true */
/*jslint todo: true */

/*!
 * astro
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Success is not final, failure is not fatal: it is the courage to ]
 * [ continue that counts.                      - Winston Churchill - ]
 */

'use strict';

/**
 * Dependencies
 */

var moment = require('moment'),
    path = require('path'),
    utils = require('./../utils.js');

(function (undefined) {

    var astro,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        localesPool = path.resolve('./locales/'),

        sunTable,

        tableParams;


    /**
     * Splits the `sec` into a `hour` and a `minute` part
     *
     * @param {sec} Integer
     * @return {hour, minute} Object
     *
     * @api private
     */

    function sec2HhMm(sec) {

        var hour = String(Math.floor(sec / 3600)),
            min = String(Math.floor((sec % 3600) / 60));

        if (hour.length === 1) {
            hour = '0' + hour;
        }

        if (min.length === 1) {
            min = '0' + min;
        }

        return {
            hour : hour,
            min : min
        };

    }

    /**
     * Merges the `hour` and the `minute` part into resulting `sec`
     *
     * @param {hhMm} Object
     * @return {sec} Integer
     *
     * @api private
     */

    function hhMm2Sec(hhMm) {
        return hhMm.hour * 3600 + hhMm.min * 60;
    }

    /**
     * Splits a value like `0600` into `hour = 06` and `min=00`
     * This time format is used by
     *   http://aa.usno.navy.mil/data/docs/RS_OneYear.php
     * in resulting tables.
     *
     * @param {hhMm} String
     * @return {hour, min} Object
     *
     * @api private
     */

    function splitHhMm(hhMm) {
        return {
            hour : hhMm.substr(0, 2),
            min : hhMm.substr(2, 3)
        };
    }

    /**
     * Adds one hour to the rise and set time if any daylight saving is
     * scheduled.
     * This is only necessary for table related rise and set times.
     * E.g.
     *   http://aa.usno.navy.mil/data/docs/RS_OneYear.php
     * doesn't deliver time tables in DST-format.
     *
     * @param {sun} Object
     * @return {sun} Object
     *
     * @api private
     */

    function adjustDST(sun) {

        if (moment().isDST()) {

            sun.sr.hour = parseInt(sun.sr.hour, 10) + 1;
            sun.ss.hour = parseInt(sun.ss.hour, 10) + 1;

            if (sun.sr.hour.toString().length === 1) {
                sun.sr.hour = '0' + sun.sr.hour;
            }

        }

        return sun;

    }

    //
    //
    //
    function readSunTable(id, cb) {

        var filename = localesPool
                + '/'
                + id
                + '-'
                + moment().year()
                + '-sun.txt';

        utils.readTextToArray(filename, function (err, table) {

            if (err) {
                cb(err, null);
            } else {
                cb(null, table);
            }

        });

    }


    /**
     * Gets a new sun rise/set object from an input array like
     * ['0600', '1800']
     *
     * @param {rs} Array
     * @return {sun} Object
     *
     * @api private
     */

    function createSunRS(rs) {

        var sr = 0,
            ss = 0,
            dl = 0;

        if (rs !== null || rs !== undefined) {

            sr = splitHhMm(rs[0]);
            ss = splitHhMm(rs[1]);
            dl = sec2HhMm(hhMm2Sec(ss) - hhMm2Sec(sr));

        }

        return {
            sr : sr,
            ss : ss,
            dl : dl,
            dld : ''
        };

    }

    /**
     * Gets a sun rise/set object for a given day `today`
     *
     * @param {today} Array
     * @param {yesterday} Array
     * @param {byTable} Boolean
     *
     * @return {sun} Object
     *
     * @api public
     */

    function sunRS4Today(sunToday, sunYesterday) {

        var sunRStoday = createSunRS(sunToday),
            sunRSyesterday,
            dld = '';

        if (sunYesterday !== null) {

            sunRSyesterday = createSunRS(sunYesterday);

            dld = String((hhMm2Sec(sunRSyesterday.dl) - hhMm2Sec(sunRStoday.dl)) / 60);
            if (dld.length === 1) {
                dld = dld === '0' ? '±' + dld : '+' + dld;
            }

            sunRStoday.dld = dld;

        }

        return sunRStoday;

    }


///////////////////////////////////////////////////////////////////////////////

    astro = function () {};

///////////////////////////////////////////////////////////////////////////////


    astro.getSun = function (sunParams, cb) {

        var sunYesterday = null,
            sunRStoday;

        readSunTable(sunParams.id, function (err, table) {

            if (table !== null) {

                sunParams.sunToday = table[sunParams.doy].split(' ');
                sunYesterday = table[sunParams.doy - 1].split(' ');

            }

            sunRStoday = sunRS4Today(sunParams.sunToday, sunYesterday);

            if (table !== null) {
                sunRStoday =  adjustDST(sunRStoday);
            }

            cb(err, sunRStoday);

        });

    }

    /**
     * Expose `astro`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = astro;
    }

}).call(this);


