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

(function (undefined) {

    var localizer,

        weather,

        VERSION = "0.4.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        i18n = new I18n(locales.locales),

        localesMap,

        location,

        tempUnit,

        dayName,

        period = 0,

        out = {
            common : {},
            header : {
                forecast : {},
                sun : {}
            },

            forecastday : []
        };

    //
    //
    //
    function commons(localized) {

        var str = i18n.__('tempUnit').split('_');

        tempUnit = str[0];
        localized.common.tempUnitToDisplay = str[1];
        localized.common.min = i18n.__('minimal');
        localized.common.max = i18n.__('maximal');

        return localized;

    }

    //
    //
    //
    function createSingleForecast(period) {

        var res = {},
            forecastday = weather.forecastday[period];

        res.temp = {};

        res.name = dayName[period];
        res.temp.high = forecastday.temp.high[tempUnit];
        res.temp.low = forecastday.temp.low[tempUnit];
        res.ic = forecastday.ic;
        res.sic = forecastday.sic;

        return res;

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
    function getForecastDayName() {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
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
    function header(localized) {

        var epoch = weather.forecastday[period].date.epoch,
            date = moment(epoch * 1000),
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            });

        localized.header.forecast = createSingleForecast(period);

        // 29 Mar
        localized.header.date = date.format(dateFormatStr);
        // 88. day of year
        localized.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
            doy: date.dayOfYear()
        });

        return localized;

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

        var sun = nodefn.lift(createSun),
            lang = params.location.lang.toLowerCase(),
            // 'moment' doesn't conforms with the ISO 3166-2
            mappedLang = localesMap[lang];

        if (mappedLang === undefined) {
            // there wasn't any mappings declared,
            // so use the original lang/country
            mappedLang = lang;
        }

        i18n.setLocale(mappedLang);
        moment.lang(mappedLang);

        // params
        weather = params.weather;
        period = params.location.period;
        location = params.location;

        dayName = getForecastDayName();

        fn.call(commons, out)
            .then(header)
            .then(sun)
            .then(forecasts)
            .then(footer)
            .then(function (localized) {
                cb(null, localized);
            }, function (err) {
                cb(err, null);
            });

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `localizer`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = localizer;
    }

}).call(this);
