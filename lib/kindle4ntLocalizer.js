/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

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
    astro = require('./astronomy/astro.js');

(function () {

    var localizer,

        VERSION = "0.4.0",

//        locales,

        i18n;

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
    function dayZero(p) {

        var wishedDayNum = p.weather.wishedDayNum,
            forecastDay = p.weather.forecastday[wishedDayNum],
            m = moment(forecastDay.date.epoch);

        //
        //
        //
        function createSun(p) {

            //
            // uses
            //   weather
            //   localized

            var sun = p.localized.header.sun,

                sunParams = {
                    id : p.weather.id,
                    doy : m.dayOfYear()
                },

                deferred = when.defer();

            //
            // @param {wfo} Object - the workflow object
            //
            function localizeSunEvent(ev, eventName) {
                return utils.fillTemplates(i18n.__(eventName), {
                    min : ev.min,
                    hour : ev.hour
                });
            }

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

                deferred.resolve(p);

            });

            return deferred.promise;

        }

        //
        //
        //
        function createHeader(p, wishedDayNum) {

            var head = p.localized.header,
                tempUnit = p.localized.common.tempUnit,
                dayName = p.localized.dayNames[wishedDayNum];

            // 29 Mar
            head.date = m.format(utils.fillTemplates(i18n.__('currDate'), {
                day: 'D',
                month: 'MMM'
            }));
            // 88. day of year
            head.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: m.dayOfYear()
            });

            head.forecast = createForecast(forecastDay, tempUnit, dayName);

            return p;

        }

        return fn.call(createHeader, p, wishedDayNum)
            .then(createSun);

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function forecasts(p) {

        var w = p.weather,
            l = p.localized;

        return when.join(
            createForecast(w.forecastday[1], l.common.tempUnit, l.dayNames[1]),
            createForecast(w.forecastday[2], l.common.tempUnit, l.dayNames[2]),
            createForecast(w.forecastday[3], l.common.tempUnit, l.dayNames[3])
        )
            .then(function (day) {

                l.forecastday = day;

                return p;

            });

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function footer(p) {

        var w = p.weather,
            l = p.localized,
            dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        l.footer = moment(w.lastObservation).format(dateFormatStr);

        return p;
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

    localizer = function (locales) {
//        locales = aLocales;
        i18n = new I18n(locales.i18n);
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

        return fn.call(dayZero, {weather : wfo.weather, localized : wfo.localized})
            .then(forecasts)
            .then(footer)
            .then(finalizeStage)
            .then(function () {
                return wfo;
            });

    };

    //
    //
    //
    localizer.prepare = function (wfo, isoLang) {

        // uses
        //  wfo.weather
        //  wfo.localized
        //  wfo.cfg

        var tu = i18n.__('tempUnit').split('_'),

            // Adding a duration of one day instead of only 24h is necessary.
            // caused by the two switches from winter to summer time and back again.
            // Otherwise the wrong day name will be displayed...
            duration = moment.duration({'days' : 1}),
            l = wfo.localized,
            w = wfo.weather;

        i18n.setLocale(isoLang);
        // 'moment' doesn't conforms with the ISO 3166-2
        moment.lang(isoLang);

        l.common.tempUnit = tu[0];
        l.common.tempUnitToDisplay = tu[1];
        l.common.min = i18n.__('minimal');
        l.common.max = i18n.__('maximal');

        l.dayNames = [
            i18n.__('today') || moment(w.date).format('dddd'),
            i18n.__('tomorrow') || moment(w.date).add(duration).format('dddd'),
            moment(w.date).add(duration).add(duration).format('dddd'),
            moment(w.date).add(duration).add(duration).add(duration).format('dddd')
        ];

        return wfo;

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
