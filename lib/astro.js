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
 */

var suncalc = require('suncalc');

(function () {

    'use strict';

    var astro,
        floor = Math.floor;

    // /////////////////////////////////////////////////////////////////////////
    // GUI
    // /////////////////////////////////////////////////////////////////////////

    //
    //
    // @api : public
    function leadingZero(num) {
        // see http://jsperf.com/left-zero-filling for performance comparison
        var s = num.toString();
        return s.length === 2 ? s : '0' + s;

    }

    //
    //
    // @api : public
    function reduce_hhmmss2hhmm(hhmmss) {
        return {
            hh : leadingZero(hhmmss.hh),
            mm : leadingZero(hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1)),
        };
    }

    // /////////////////////////////////////////////////////////////////////////
    // Business layer
    // /////////////////////////////////////////////////////////////////////////

    // http://mathnotepad.com/

    //
    //
    // @api : public
    function sec2hhmmss(sec) {

        var reminder = sec % 3600;  // remaining seconds of the uncomplete hour

        return {
            hh : floor(sec / 3600),
            mm : floor(reminder / 60),
            ss : reminder % 60
        };

    }

    //
    //
    //
    function dateTime2hhmmss(date) {
        return {
            hh : date.getHours(),
            mm : date.getMinutes(),
            ss : date.getSeconds()
        };
    }

    //
    //
    // @api : private
    function getTimes(date, lat, lon) {

        var sun = suncalc.getTimes(new Date(date), lat, lon);

        return {
            sunrise : reduce_hhmmss2hhmm(dateTime2hhmmss(sun.sunrise)),
            solarnoon : reduce_hhmmss2hhmm(dateTime2hhmmss(sun.solarNoon)),
            sunset : reduce_hhmmss2hhmm(dateTime2hhmmss(sun.sunset)),
            daylength : sun.sunset.valueOf() - sun.sunrise.valueOf()
        };

    }

    function Astro () {}

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

            console.log('jjjjj', times);

            return times;

        },

        formatDayLengthDiff : function (hhmmss) {

            var mmStr = Math.abs(hhmmss.mm).toString(),
                mm = hhmmss.mm < 0
                    ? '-' + mmStr
                    : mmStr;

            return mm + ':' + leadingZero(hhmmss.ss);
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








