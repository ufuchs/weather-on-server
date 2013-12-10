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
    function createForecast(wfo, period) {

        var forecastday = wfo.weather.forecastday[period],
            tempUnit = wfo.localized.common.tempUnit;

        return {
            name : wfo.localized.dayNames[period],
            temp : {
                high : forecastday.temp.high[tempUnit], // field!
                low : forecastday.temp.low[tempUnit]    // field!
            },
            ic : forecastday.ic,
            sic : forecastday.sic
        };

    }

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
    // @return Array - the day names of the four forecast days
    //
    function getForecastDayName(wfo) {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = wfo.weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
            today = i18n.__('today'),
            tomorrow = i18n.__('tomorrow');

        if ((today === '') || (today === null)) {
            // there isn't any user defined value
            today = moment(date).format('dddd');
        }

        if ((tomorrow === '') || (tomorrow === null)) {
            tomorrow = moment(date).add(duration).format('dddd');
        }

        return [
            today,
            tomorrow,
            moment(date).add(duration).add(duration).format('dddd'),
            moment(date).add(duration).add(duration).add(duration).format('dddd')
        ];

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function commons(wfo) {

        var str = i18n.__('tempUnit').split('_'),
            common = wfo.localized.common;

        common.tempUnit = str[0];
        common.tempUnitToDisplay = str[1];
        common.min = i18n.__('minimal');
        common.max = i18n.__('maximal');

        wfo.localized.dayNames = getForecastDayName(wfo);

        return wfo;

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function header(wfo) {

        //
        //
        //
        function createHeader(wfo) {

            var period = wfo.location.period,
                forecastDay = wfo.weather.forecastday[period],
                date = moment(forecastDay.date.epoch),
                head = wfo.localized.header,
                dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                    day: 'D',
                    month: 'MMM'
                });

            // 29 Mar
            head.date = date.format(dateFormatStr);
            // 88. day of year
            head.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: date.dayOfYear()
            });

            head.forecast = createForecast(wfo, period);

            return wfo;

        }

        //
        //
        //
        function createSun(wfo) {

            var sun = wfo.localized.header.sun,
                period = wfo.location.period,
                sunParams = {
                    id : wfo.location.id,
                    sunToday : [ wfo.weather.sun.sr, wfo.weather.sun.ss ],
                    doy : moment(wfo.weather.date).dayOfYear() + period
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

        return fn.call(createHeader, wfo)
            .then(createSun);

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function forecasts(wfo) {

        var i = 1;

        for (i; i < 4; i += 1) {
            wfo.localized.forecastday[i] = createForecast(wfo, i);
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
        moment().lang()._monthsShort = "Jan._Febr._März_Apr._Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split("_");

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
        applyPatch_de();
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

        var isoLang = locales.mapIsoToI18n(wfo.location.lang);

        // 2013-12-09 : check this!
        i18n.setLocale(isoLang);
        // 'moment' doesn't conforms with the ISO 3166-2
        moment.lang(isoLang);

        return fn.call(commons, wfo)
            .then(header)
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
