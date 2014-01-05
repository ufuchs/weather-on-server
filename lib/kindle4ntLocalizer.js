/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

/*!
 * localizer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
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
    astro = require('./astronomy/astro.js'),
    locales = require('./../locales/locales.js').locales;

(function () {

    var localizer,

        VERSION = "0.4.0",

        i18n = new I18n(locales.i18n);


    //
    // @param {wfo} Object - the workflow object
    //
    function localizeSunEvent(ev, eventName) {
        return utils.fillTemplates(i18n.__(eventName), {
            min : ev.min,
            hour : ev.hour
        });
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function prepare(wfo) {

        // uses
        //  wfo.weather
        //

        var tu = i18n.__('tempUnit').split('_'),
            common = wfo.localized.common;

        function getForecastDayName(wfo) {

            // Adding a duration of one day instead of only 24h is necessary.
            // caused by the two switches from winter to summer time and back again.
            // Otherwise the wrong day name will be displayed...
            var duration = moment.duration({'days' : 1}),
                m = moment(wfo.weather.date);

            return [
                i18n.__('today') || m.format('dddd'),
                i18n.__('tomorrow') || m.add(duration).format('dddd'),
                m.add(duration).add(duration).format('dddd'),
                m.add(duration).add(duration).add(duration).format('dddd')
            ];

        }

        common.tempUnit = tu[0];
        common.tempUnitToDisplay = tu[1];
        common.min = i18n.__('minimal');
        common.max = i18n.__('maximal');

        wfo.localized.dayNames = getForecastDayName(wfo);

        return wfo;

    }

    // Creates the forecast for a single day.
    // Returns the
    //   name of the day
    //   temparature high
    //   temparature low
    //   icon
    //   sky icon
    //
    // @param {wfo} Object - the workflow object
    // @param {period} int - day in the four day forecast, starts with 0 for day one
    // @return Object
    //
    function createForecast(forecastday, tempUnit, dayName) {

        return {
            name : dayName,
            temp : {
                high : forecastday.temp.high[tempUnit],
                low : forecastday.temp.low[tempUnit]
            },
            ic : forecastday.ic,
            sic : forecastday.sic
        };

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function dayZero(wfo) {

        var period = wfo.cfg.location.period,
            forecastDay = wfo.weather.forecastday[period],
            m = moment(forecastDay.date.epoch);

        //
        //
        //
        function createHeader(head, tempUnit, dayName) {

            // 29 Mar
            head.date = m.format(utils.fillTemplates(i18n.__('currDate'), {
                day: 'D',
                month: 'MMM'
            }));
            // 88. day of year
            head.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: m.dayOfYear()
            });

            head.forecast = {
                name : dayName,
                temp : {
                    high : forecastDay.temp.high[tempUnit],
                    low : forecastDay.temp.low[tempUnit]
                },
                ic : forecastDay.ic,
                sic : forecastDay.sic
            };

        }

        //
        //
        //
        function createSun(wfo) {

            var sun = wfo.localized.header.sun,

                sunParams = {
                    id : wfo.cfg.location.id,
                    doy : m.dayOfYear()
                },

                deferred = when.defer();

            astro.getSun(sunParams, function (err, sunRStoday) {

                sun.sr = localizeSunEvent(sunRStoday.sr, 'sunrise');
                sun.ss = localizeSunEvent(sunRStoday.ss, 'sunset');
                sun.dl = localizeSunEvent(sunRStoday.dl, 'dayLenght');
                sun.dld = '';

                if (sunRStoday.dld !== '') {
                    sun.dld = utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                        min : sunRStoday.dld
                    });
                }

                deferred.resolve(wfo);

            });

            return deferred.promise;

        }

        return fn.call(createHeader,
                wfo.localized.header,
                wfo.localized.common.tempUnit,
                wfo.localized.dayNames[period])
            .then(function () {
                return wfo;
            })
            .then(createSun);

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function forecasts(wfo) {

        var i = 1;

        for (i; i < 4; i += 1) {
            wfo.localized.forecastday[i] = createForecast(
                wfo.weather.forecastday[i],
                wfo.localized.common.tempUnit,
                wfo.localized.dayNames[i]
            );

        }

        return wfo;
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function footer(wfo) {

        var dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        wfo.localized.footer = moment(wfo.weather.lastObservation).format(dateFormatStr);

        return wfo;
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function finalizeStage(wfo) {

        delete wfo.weather;
        delete wfo.localized.dayNames;
        return wfo;

    }

    //
    //
    //
    function applyPatch_de() {

        var defLang = moment.lang();

        moment().lang('de');

        // The original `_monthsShort` doesn't conforms with the German 'DUDEN'.
        //
        // @see http://www.duden.de/suchen/dudenonline/Monat
        //
        // And 'moment().lang('de')._monthsShort' doesn't works.
        moment().lang()._monthsShort =
            "Jan._Febr._März_Apr._Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split("_");

        moment().lang(defLang);

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Localizer for the extracted weather data.
     *
     * @return Object
     *
     * @api public
     */

    localizer = function () {
//        applyPatch_de();
    };

    // version number
    localizer.version = VERSION;

    /**
     * Localizes the given `wfo` object.
     *
     * @param {wfo} Object - the workflow object
     *
     * @api public
     */

    localizer.localize = function (wfo) {

        var cfg = wfo.cfg,
            isoLang = locales.mapIsoToI18n(cfg.location.lang);

        // 2013-12-09 : check this!
        i18n.setLocale(isoLang);
        // 'moment' doesn't conforms with the ISO 3166-2
        moment.lang(isoLang);

        return fn.call(prepare, wfo)
            .then(function (wfo) {
                return wfo;
            }, function (err) {
                console.log('err-001', err);
            })
            .then(dayZero)
            .then(forecasts)
            .then(footer)
            .then(finalizeStage);

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
