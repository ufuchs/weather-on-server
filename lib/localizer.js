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
    deferred = require('deferred'),
    utils = require('./utils.js'),
    locales = require('./../locales/locales.js'),
    astro = require('./astronomy/utils.js');

(function (undefined) {

    var localizer,

        weather,

        sunTable,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        i18n = new I18n(locales.locales),

        localesMap;

    //
    //
    //
    function prepareLocalized() {

        return {
            common : {},
            header : {},
            sun : {}
        };

    }

    //
    //
    //
    function commons() {

        var str = i18n.__('tempUnit').split('_'),
            localized = {};

        localized.common = {};

        localized.common.tempUnit = str[0];
        localized.common.tempUnitToDisplay = str[1];
        localized.common.min = i18n.__('minimal');
        localized.common.max = i18n.__('maximal');

        return localized;

    }

    //
    //
    //
    function header(localized) {

        var date = moment(weather.date),
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            today = i18n.__('today'),
            doy = date.dayOfYear(),
            year = date.year(),
            doyReverse = moment(year + '-12-31', "YYYY-MM-DD").dayOfYear() - doy;

        localized.header = {};

        if ((today === '') || (today === null)) {
            today = date.format('dddd');
        }

        localized.header.today = today;
        // 29 Mar
        localized.header.date = date.format(dateFormatStr);
        // 88. day of year

        if (date.month() >= 5 && date.date() >= 21) {

            localized.header.doy = utils.fillTemplates('{{doy}} Tage bis Silvester', {
                doy: doyReverse - 1
            });

        } else {

            localized.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: date.dayOfYear()
            });

        }

        return localized;

    }

    //
    //
    //
    function localizeSunEvent(value, eventName) {

        var hhmm = astro.sec2HhMm(value),
            toLocalize = {};

        toLocalize.min = hhmm.min;

        if (eventName === 'dayLenght') {
            toLocalize.hours = hhmm.hour;
        } else {
            toLocalize.hour = hhmm.hour;
        }

        return utils.fillTemplates(i18n.__(eventName), toLocalize);

    }

    //
    // @param {}
    //
    function sun(localized) {

        var hhmm,
            mm,
            sr,
            ss,
            doy = moment(weather.date).dayOfYear();

        localized.sun = {};

        if (sunTable !== null) {

            // reading from table
            weather.sun = astro.getSun(sunTable[doy].split(' '), sunTable[doy - 1].split(' '));

            if (moment().isDST()) {
                weather.sun.sr += 3600;
                weather.sun.ss += 3600;
            }

        }

        localized.sun.sr = localizeSunEvent(weather.sun.sr, 'sunrise');
        localized.sun.ss = localizeSunEvent(weather.sun.ss, 'sunset');
        localized.sun.dl = localizeSunEvent(weather.sun.dl, 'dayLenght');

        if (weather.sun.dld !== '') {

            mm = weather.sun.dld / 60;

            if (mm.toString().length === 1) {

                mm = mm === 0 ? '±' + mm : '+' + mm;

            }

            localized.sun.dld = utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                min : mm
            });

        }

        return localized;

    }

    //
    //
    //
    function weekdays(localized) {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
            tomorrow = i18n.__('tomorrow');

        localized.weekdays = {};

        if ((tomorrow === '') || (tomorrow === null)) {
            tomorrow = moment(date).add(duration).format('dddd');
        }

        localized.weekdays.tomorrow = tomorrow;
        localized.weekdays.day_after_tomorrow = moment(date).add(duration).add(duration).format('dddd');
        localized.weekdays.day_after_tomorrow_plusOne = moment(date).add(duration).add(duration).add(duration).format('dddd');

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

        // The original `_monthsShort` doesn't conforms with the german 'DUDEN'.
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
     * Localizes the given `weather` data.
     *
     * @ param {weather} Object - extracted weather data
     * @ param {params} Object - contains device and language infos
     *
     * @api public
     */

    localizer.localize = function (updatedWeather, params, theSunTable, cb) {

        var lang = params.lang.toLowerCase(),
            // 'moment' doesn't conforms with the ISO 3166-2
            mappedLang = localesMap[lang];

        if (mappedLang === undefined) {
            // there wasn't any mappings declared,
            // so use the original lang/country
            mappedLang = lang;
        }

        i18n.setLocale(mappedLang);
        moment.lang(mappedLang);

        weather = updatedWeather;
        sunTable = theSunTable;

        // fix : It needs chaining to eliminate side effect.
        // occasion : 'footer' shows wrong month after changing the `device'
        deferred().resolve(commons())
            .then(header)
            .then(sun)
            .then(weekdays)
            .then(footer)
            .then(function (localized) {
                cb(localized);
            })
            .done();
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
