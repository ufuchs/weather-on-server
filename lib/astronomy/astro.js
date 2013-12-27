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

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        localesPool = path.resolve('./locales/');

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
    function readSunTableEx(params, cb) {

        var filename = localesPool
                + '/'
                + params.id
                + '-'
                + params.year
                + '-sun.txt';

        utils.readTextToArray(filename, function (err, table) {

            if (err) {
                cb(err, null);
            } else {
                cb(null, table);
            }

        });

    }


    function readSunTable(input, cb) {

        var params = {
                id : input.id,
                year : moment().year()
            };

        readSunTableEx(params, function (err, currYear) {

            if (err) {
                cb(err, null);
            } else {

                if (input.doy + 4 > 365) {

                    // handles the turn of the year
                    params.year += 1;
                    readSunTableEx(params, function (err, nextYear) {

                        if (err) {
                            cb(err, null);
                        } else {

                            // remove the comment/placeholder line
                            nextYear.shift();

                            // append the items of the next year on the currYear.
                            // so it's possible to count up the day of the year > 365/366
                            cb(null, currYear.concat(nextYear));
                        }

                    });

                } else {
                    cb(null, currYear);
                }

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

            dld = String((hhMm2Sec(sunRStoday.dl) - hhMm2Sec(sunRSyesterday.dl)) / 60);
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

        console.log(sunParams);

        readSunTable(sunParams, function (err, table) {

            if (table !== null) {

                sunParams.sunToday = table[sunParams.doy].split(' ');
                sunYesterday = table[sunParams.doy - 1].split(' ');

            }

            sunRStoday = sunRS4Today(sunParams.sunToday, sunYesterday);

            if (table !== null) {
                sunRStoday =  adjustDST(sunRStoday);
            }

            cb(null, sunRStoday);

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


