/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * astroEx
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Whenever you find yourself on the side of the majority, it is time to ]
 * [ pause and reflect.                                     - Oscar Wilde -]
 *
 */

var suncalc = require('./sunJS/suncalc.js'),
    Q = require('q');

(function () {

    "use strict";

    var astro;

    astro = function () {

        var days,
            prevDate = null;

        return {
            init: function (date, lat, lon) {
                days = suncalc.getTimes(date, lat, lon);
                prevDate = date;
            },
            getDay: function (dayNum) {
                return days[dayNum];
            }
        };

    }();


    /**
     * Expose `astro`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = astro;
    }

}());

