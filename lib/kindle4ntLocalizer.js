/*vim: et:ts=4:sw=4:sts=4 */
/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * kindle4ntLocalizer
 * Copyright(c) 2013-2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ However beautiful the strategy, you should occasionally look at ]
 * [ the results.                              - Winston Churchill - ]
 */

/**
 * Dependencies
 */

var fn = require("when/function"),
    when = require('when'),
    parent = require('./localizer.js');

(function () {

    'use strict';

    var localizer;

    //
    //
    //
    function dayZero(p, dayNum) {
        return parent.dayZero(p, dayNum);
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function forecasts(p) {
        return when.join(
            parent.createForecast(p, 1),
            parent.createForecast(p, 2),
            parent.createForecast(p, 3)
        )
            .then(function (day) {
                p.localized.forecastday = day;
                return p;
            });
    }

    //
    //
    //
    function footer(p) {
        return parent.footer(p);
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function finalizeStage(p) {

        delete p.weather;
        delete p.localized.dayNames;
        return p;

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Localizer for the extracted weather data.
     *
     * @return Object
     *
     * @api public
     */

     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

    localizer = function (locales) {
        parent.init(locales);
    };

    //
    //
    //
    localizer.prepare = function (wfo, isoLang) {
        parent.prepare(wfo, isoLang);
    };

    /**
     * Localizes the given `wfo` object.
     *
     * @param {wfo} Object - the workflow object
     *
     * @api public
     */

    localizer.localize = function (wfo, dayNum) {
        return fn.call(dayZero, {weather : wfo.weather, localized : wfo.localized}, dayNum || 0)
            .then(forecasts)
            .then(footer)
//            .then(finalizeStage)
            .then(function () {
                return wfo;
            }, function (err) {
                console.log(err);
            });
    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `localizer`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = localizer;
    }

}());
