/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * astro
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 *   [ Whenever you find yourself on the side of the majority, it is time to ]
 *   [ pause and reflect.                                     - Oscar Wilde -]
 *
 * issues:
 * 2014-JUL-03 Formatting is in here misplaced
 */

var suncalc = require('suncalc');

(function () {

    'use strict';

    var astro,
        floor = Math.floor;

    // /////////////////////////////////////////////////////////////////////////
    // helpers
    // /////////////////////////////////////////////////////////////////////////

    // http://mathnotepad.com/

    // Gets the string representation of a 2-digit number with leading zero
    // @param {num} Integer - Number to convert
    // @return String - String representation with leading zero
    // @api : private
    function leadingZero(num) {
        // see http://jsperf.com/left-zero-filling for performance comparison
        var s = num + '';
        return s.length === 2 ? s : '0' + s;
    }

    // Drops the seconds from a given 'hhmmss' object
    // @param {hhmmss} Object - the given 'hhmmss' object
    // @return Object - a 'hhmm' object
    // @api : private
    function reduce_hhmmss2hhmm(hhmmss) {
        return {
            sign : hhmmss.sign,
            hh : leadingZero(hhmmss.hh),
            mm : leadingZero(hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1)),
        };
    }

    // Splits a number of seconds into hour, minute, seconds
    // @param {num} Integer - number of seconds
    // @return Object - A sign plus hours, minutes, seconds
    // @api : private
    function sec2hhmmss(sec) {

        var reminder = Math.abs(sec) % 3600;  // remaining seconds of the uncomplete hour

        return {
            sign : sec >= 0 ? 1 : -1,
            hh : floor(Math.abs(sec) / 3600),
            mm : floor(reminder / 60),
            ss : reminder % 60
        };

    }

    //
    //
    // @api : private
    function getTimes(date, lat, lon) {

        var sun = suncalc.getTimes(new Date(date), lat, lon);

        // Converts a Date object into an internal representation
        // @param {date} Date - given Date object
        // @return Object - internal representation
        // @api : private
        function dateTime2hhmmss(date) {
            return reduce_hhmmss2hhmm(
                {
                    hh : date.getHours(),
                    mm : date.getMinutes(),
                    ss : date.getSeconds()
                }
            );
        }

        return {
            sunrise : dateTime2hhmmss(sun.sunrise),
            solarnoon : dateTime2hhmmss(sun.solarNoon),
            sunset : dateTime2hhmmss(sun.sunset),
            // --> here is the problem. Make a object.instead of seconds
            daylength : sun.sunset.valueOf() - sun.sunrise.valueOf()
        };

    }

    // /////////////////////////////////////////////////////////////////////////
    // Constructors
    // /////////////////////////////////////////////////////////////////////////

    function Astro () {}

    // /////////////////////////////////////////////////////////////////////////
    // Astro Prototype
    // /////////////////////////////////////////////////////////////////////////

    Astro.prototype = {

        getTimesOfSun : function (date, lat, lon) {

            var times = getTimes(date, lat, lon),
                timesDayBefore = getTimes(date - 86400 * 1000, lat, lon);


            times.dld = sec2hhmmss(floor((times.daylength
                - timesDayBefore.daylength) / 1000));

            // ! keep the code line on this position !
            // 'dld' should calced before.
            times.daylength = reduce_hhmmss2hhmm(
                sec2hhmmss(floor(times.daylength / 1000))
            );

            return times;

        },

        //! misplaced
        formatDayLengthDiff : function (hhmmss) {
            return (hhmmss.mm * hhmmss.sign) + ':' + leadingZero(hhmmss.ss);
        }

    };

    astro = function () {
        return new Astro();
    };

    /**
     * Expose `astro`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = astro;
    }

}());








