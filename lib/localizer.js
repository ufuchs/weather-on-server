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
    utils = require('./utils.js'),
    locales = require('./../locales/locales.js'),
    astro = require('./astronomy/utils.js');

(function (undefined) {

    var localizer,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        i18n = new I18n(locales.locales),

        localesMap;

    //
    //
    //
    function commons(weather, cb) {

        var str = i18n.__('tempUnit').split('_');

        cb({
            tempUnit : str[0],
            tempUnitToDisplay : str[1],
            min : i18n.__('minimal'),
            max : i18n.__('maximal')
        });

    }

    //
    //
    //
    function header(weather, cb) {

        var date = weather.date,
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            today = i18n.__('today');

        if ((today === '') || (today === null)) {
            today = moment(date).format('dddd');
        }

        cb({
            today : today,
            // 29 Mar
            date : moment(date).format(dateFormatStr),
            // 88. day of year
            doy : utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: moment(date).dayOfYear()
            })
        });
    }

    //
    //
    //
    function sun(weather, sunParams, cb) {

        var hhmm,
            mm,
            sr,
            ss,
            dayLenght,
            dayLenghtDiff = '',
            doy = moment(weather.date).dayOfYear(),
            sn = {};

        if (sunParams !== null) {

            sn = astro.getSun(sunParams[doy].split(' '), sunParams[doy - 1].split(' '));

            if (moment().isDST()) {
                sn.sr += 3600;
                sn.ss += 3600;
            }


        } else {
            sn.sr = weather.sun.rise;
            sn.ss = weather.sun.set;
            sn.dl = weather.sun.dayLength;
            sn.dld = ''; //weather.sun.dayLengthDiff;
        }

        hhmm = astro.sec2HhMm(sn.sr);
        sr = utils.fillTemplates(i18n.__('sunrise'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(sn.ss);
        ss = utils.fillTemplates(i18n.__('sunset'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(sn.dl);
        dayLenght = utils.fillTemplates(i18n.__('dayLenght'), {
            hours : hhmm.hour,
            min : hhmm.min
        });

        if (sn.dld !== '') {

            mm = sn.dld / 60;

            if (mm.toString().length === 1) {

                if (mm === 0) {
                    mm = '±' + mm;
                } else {
                    mm = '+' + mm;
                }

                console.log(mm);

            }

            dayLenghtDiff = utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                min : mm
            });

        }

        cb({
            sr : sr,
            ss : ss,
            dayLenght : dayLenght,
            dayLenghtDiff : dayLenghtDiff
        });
    }

    //
    //
    //
    function weekdays(weather, cb) {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
            tomorrow = i18n.__('tomorrow');

        if ((tomorrow === '') || (tomorrow === null)) {
            tomorrow = moment(date).add(duration).format('dddd');
        }

        cb({
            tomorrow : tomorrow,
            day_after_tomorrow : moment(date).add(duration).add(duration).format('dddd'),
            day_after_tomorrow_plusOne : moment(date).add(duration).add(duration).add(duration).format('dddd')
        });

    }

    //
    //
    //
    function footer(weather, cb) {

        var dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        cb(moment(weather.lastObservation).format(dateFormatStr));
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

    localizer.localize = function (weather, params, sunParams, cb) {

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

        // fix : It needs chaining to eliminate side effect.
        // occasion : 'footer' shows wrong month after changing the `device'
        commons(weather, function (cresult) {
            header(weather, function (hresult) {
                sun(weather, sunParams, function (sresult) {
                    weekdays(weather, function (wresult) {
                        footer(weather, function (fresult) {
                            cb({
                                common : cresult,
                                header : hresult,
                                sun : sresult,
                                weekdays : wresult,
                                footer : fresult
                            });
                        });
                    });
                });
            });
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