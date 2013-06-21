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
    Q = require('q'),
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

        var date = weather.date,
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            today = i18n.__('today');

        localized.header = {};

        if ((today === '') || (today === null)) {
            today = moment(date).format('dddd');
        }

        localized.header.today = today;
        // 29 Mar
        localized.header.date = moment(date).format(dateFormatStr);
        // 88. day of year
        localized.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
            doy: moment(date).dayOfYear()
        });

        return localized;

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

        console.log(weather.sun);

        hhmm = astro.sec2HhMm(weather.sun.sr);
        localized.sun.sr = utils.fillTemplates(i18n.__('sunrise'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.sun.ss);
        localized.sun.ss = utils.fillTemplates(i18n.__('sunset'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.sun.dl);
        localized.sun.dayLength = utils.fillTemplates(i18n.__('dayLenght'), {
            hours : hhmm.hour,
            min : hhmm.min
        });

        if (weather.sun.dld !== '') {

            mm = weather.sun.dld / 60;

            if (mm.toString().length === 1) {

                if (mm === 0) {
                    mm = '±' + mm;
                } else {
                    mm = '+' + mm;
                }

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
     *
     * @api private
     */

    function Localizer() {

        localesMap = locales.iso3166ToLocale;
        applyPatch_de();

    }

    /**
     * Localizer for the extracted weather data.
     *
     * @return Object
     *
     * @api public
     */

    localizer = function () {
        return new Localizer();
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

    localizer.localize = function (theWeather, params, theSunTable, cb) {

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

        weather = theWeather;
        sunTable = theSunTable;


        var funcs = [commons, header, sun, weekdays, footer];

        // fix : It needs chaining to eliminate side effect.
        // occasion : 'footer' shows wrong month after changing the `device'
        Q.fcall(commons)
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
