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
 */

//var suncalc = require('suncalc');
var suncalc = require('./sunJS/suncalc.js');

(function () {

    'use strict';

    var astro,
        floor = Math.floor;

    // /////////////////////////////////////////////////////////////////////////
    // helpers
    // /////////////////////////////////////////////////////////////////////////

    // http://mathnotepad.com/

    // Drops the seconds from a given 'hhmmss' object
    // @param {hhmmss} Object - the given 'hhmmss' object
    // @return Object - a 'hhmm' object
    // @api : private
    function hhmmss2hhmm(hhmmss) {
        return {
            sign : hhmmss.sign,
            hh : hhmmss.hh,
            mm : hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1),
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

    // Gets rise, transit, set times and time over horizont of the sun
    // @param {date} Date - current date
    // @param {lat} Number - latitude of the location
    // @param {lon} Number - longitude of the location
    // @api : private
    function getSunParamsLocal(date, lat, lon) {

        var sun = suncalc.getTimes(new Date(date), lat, lon);


        // Converts a Date object into an internal representation
        // @param {date} Date - given Date object
        // @return Object - internal representation
        // @api : private
        function date2hhmmss(t) {
            return hhmmss2hhmm(
                {
                    hh : t.hours,
                    mm : t.min,
                    ss : t.sec
                }
            );
        }

        return {
            sunrise : sec2hhmmss(sun.sunrise),
            transit : sec2hhmmss(sun.solarNoon),
            sunset : sec2hhmmss(sun.sunset),
            timeOverHorizont : (sun.sunset - sun.sunrise) * 1000,
        };


        // // Converts a Date object into an internal representation
        // // @param {date} Date - given Date object
        // // @return Object - internal representation
        // // @api : private
        // function date2hhmmss(date) {
        //     return hhmmss2hhmm(
        //         {
        //             hh : date.getHours(),
        //             mm : date.getMinutes(),
        //             ss : date.getSeconds()
        //         }
        //     );
        // }

        // return {
        //     sunrise : date2hhmmss(sun.sunrise),
        //     transit : date2hhmmss(sun.solarNoon),
        //     sunset : date2hhmmss(sun.sunset),
        //     timeOverHorizont : sun.sunset.valueOf() - sun.sunrise.valueOf(),
        // };

    }

    // /////////////////////////////////////////////////////////////////////////
    // Constructors
    // /////////////////////////////////////////////////////////////////////////

    function Astro () {}

    // /////////////////////////////////////////////////////////////////////////
    // Astro Prototype
    // /////////////////////////////////////////////////////////////////////////

    Astro.prototype = {

        getSunParams : function (date, lat, lon) {

            var sunParams = getSunParamsLocal(date, lat, lon),
                sunParamsYesterday =
                    getSunParamsLocal(date - (86400 * 1000), lat, lon);

            sunParams.dld = sec2hhmmss(floor((sunParams.timeOverHorizont
                - sunParamsYesterday.timeOverHorizont) / 1000));

            // ! keep the code line on this position !
            // 'dld' should calced before.
            sunParams.timeOverHorizont = hhmmss2hhmm(
                sec2hhmmss(floor(sunParams.timeOverHorizont / 1000))
            );

            console.log(sunParams);

            return sunParams;

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








