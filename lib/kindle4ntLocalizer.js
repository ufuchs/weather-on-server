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
    utils = require('./utils.js'),
    when = require('when'),
    localizer = require('./localizer.js');

(function () {

    'use strict';

    var extend = utils.extend,
        kindle4ntLocalizer;

    /************************************
        Kindle4ntLocalizer
    ************************************/

    function Kindle4ntLocalizer(locales) {
        localizer(locales);
    }

    /************************************
        Top Level Functions
    ************************************/

    kindle4ntLocalizer = function makeKindle4ntLocalizer(locales) {
        return new Kindle4ntLocalizer(locales);
    };

    /************************************
        Kindle4ntLocalizer Prototype
    ************************************/

    Kindle4ntLocalizer.prototype = Object.create(localizer.fn);

//    extend(kindle4ntLocalizer.fn = Kindle4ntLocalizer.prototype, localizer.fn);

    Kindle4ntLocalizer.prototype.forecasts = function (p) {
        return when.join(
            this.createForecast(p, 1),
            this.createForecast(p, 2),
            this.createForecast(p, 3)
        )
            .then(function (day) {

                p.localized.forecastday = day;

                console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', p.localized);
                return p;
            });
    };

    /**
     * Localizes the given `wfo` object.
     *
     * @param {wfo} Object - the workflow object
     *
     * @api public
     */

    Kindle4ntLocalizer.prototype.localize = function (wfo, dayNum) {

        console.log(this.dayZero({weather : wfo.weather, localized : wfo.localized}, dayNum || 0));

        console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');

        return fn.call(this.dayZero, {weather : wfo.weather, localized : wfo.localized}, dayNum || 0)
            .then(function (p) {
                console.log(p.localized);
                return p;
            })
            .then(this.forecasts)
            .then(this.footer)
//            .then(finalizeStage)
            .then(function () {
                console.log(wfo.localized);
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
        module.exports = kindle4ntLocalizer;
    }

}());
