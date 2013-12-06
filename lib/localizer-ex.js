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
    fn   = require('when/function'),
    nodefn = require("when/node/function"),
    utils = require('./utils.js'),
    astro = require('./astronomy/astro.js'),
    locales = require('./../locales/locales.js');

(function () {

    var localizer,

        VERSION = "0.4.0",

        i18n = new I18n(locales.locales), // race condition!

        localesMap;

    // Creates the forecast for a single day.
    // Returns the
    //   name of the day
    //   temparature high
    //   temparature low
    //   icon
    //   sky icon
    //
    // @param {period} int - day in the four day forecast, starts with 0 for day one
    // @return Object
    //
    function createSingleForecast(params, period) {

        var forecastday = params.weather.forecastday[period],
            tempUnit = params.localized.common.tempUnit;

        return {
            name : params.localized.dayNames[period],
            temp : {
                high : forecastday.temp.high[tempUnit], // field!
                low : forecastday.temp.low[tempUnit]    // field!
            },
            ic : forecastday.ic,
            sic : forecastday.sic
        };

    }

    //
    //
    //
    function localizeSunEvent(ev, eventName) {
        return utils.fillTemplates(i18n.__(eventName), {
            min : ev.min,
            hour : ev.hour
        });
    }


    //
    //
    //
    function getForecastDayName(params) {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = params.weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
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
    //
    //
    function commons(params) {

        var str = i18n.__('tempUnit').split('_'),
            common = params.localized.common;

        common.tempUnit = str[0];
        common.tempUnitToDisplay = str[1];
        common.min = i18n.__('minimal');
        common.max = i18n.__('maximal');

        return params;

    }

    //
    //
    //
    function header(params) {

        var period = params.location.period,
            date = moment(params.weather.forecastday[period].date.epoch),
            head = params.localized.header,
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'D',
                month: 'MMM'
            });

        head.forecast = createSingleForecast(params, 0);

        // 29 Mar
        head.date = date.format(dateFormatStr);
        // 88. day of year
        head.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
            doy: date.dayOfYear()
        });

        console.log(head);

        return params;

    }

/*

    //
    // @param {}
    //
    function createSun(localized, cb) {

        var sun = {},
            params = {
                id : location.id,
                sunToday : [ weather.sun.sr, weather.sun.ss ],
                doy : moment(weather.date).dayOfYear() + period
            };

        astro.getSun(params, function (err, sunRStoday) {

            sun.sr = localizeSunEvent(sunRStoday.sr, 'sunrise');
            sun.ss = localizeSunEvent(sunRStoday.ss, 'sunset');
            sun.dl = localizeSunEvent(sunRStoday.dl, 'dayLenght');
            sun.dld = '';
            if (sunRStoday.dld !== '') {
                sun.dld = utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                    min : sunRStoday.dld
                });
            }

            localized.header.sun = sun;

            cb(err, localized);

        });

    }


    //
    //
    //
    function forecasts(localized) {

        var i = 1;

        for (i; i < 4; i += 1) {
            localized.forecastday[i] = createSingleForecast(i);
        }

        return localized;
    }

    //
    //
    //
    function footer(localized) {

        var dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        localized.footer = moment(weather.lastObservation).format(dateFormatStr);

        return localized;
    }

*/

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
        moment().lang()._monthsShort = ['Jan.', 'Febr.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];

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

        localesMap = locales.iso3166ToLocale;
        applyPatch_de();

    };

    // version number
    localizer.version = VERSION;

    /**
     * Localizes the given `param` object.
     *
     * @param {params} Object - contains `weather', `location' and `period` infos
     *
     * @api public
     */

    localizer.localize = function (params, cb) {

        var //sun = nodefn.lift(createSun),
            lang = params.location.lang.toLowerCase(),
            // 'moment' doesn't conforms with the ISO 3166-2
            mappedLang = localesMap[lang] || lang;

        /*
        if (mappedLang === undefined) {
            // there wasn't any mappings declared,
            // so use the original lang/country
            mappedLang = lang;
        }
        */

        i18n.setLocale(mappedLang);
        moment.lang(mappedLang);

        params.localized.dayNames = getForecastDayName(params);

        fn.call(commons, params)
            .then(header)
//            .then(sun)
//            .then(forecasts)
//            .then(footer)
            .then(function (l) {
                cb(null, l);
            }, function (err) {
                cb(err, null);
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
