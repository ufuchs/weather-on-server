/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

// vim: et:ts=4:sw=4:sts=4

'use strict';

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

var moment = require('moment'),
    I18n = require('i18n-2'),
    fn = require("when/function"),
    when = require('when'),
    utils = require('./utils.js'),
    astro = require('./astro.js'),
    parent = require('./localizer.js');


(function () {

    var localizer;

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

        if (dayNum === undefined) {
            dayNum = 0;
        }

        return fn.call(parent.dayZero, {weather : wfo.weather, localized : wfo.localized}, dayNum)
            .then(forecasts)
            .then(parent.footer)
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
