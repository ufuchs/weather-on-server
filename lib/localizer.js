/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

/*!
 * localizer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var moment = require('moment'),
    utils = require('./utils.js'),
    astro = require('./astronomy/utils.js');

(function (undefined) {

    var localizer,

        i18n,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);

    //
    //
    //
    function commons(weather) {

        var str = i18n.__('tempUnit').split('_');

        return {
            tempUnit : str[0],
            tempUnitToDisplay : str[1],
            min : i18n.__('minimal'),
            max : i18n.__('maximal')
        };

    }

    //
    //
    //
    function header(weather) {

        var date = weather.date,
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            today = i18n.__('today');

        if ((today === '') || (today === null)) {
            today = moment(date).format('dddd');
        }

        return {
            today : today,
            // 29 Mar
            date : moment(date).format(dateFormatStr),
            // 88. day of year
            doy : utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: moment(date).dayOfYear()
            })
        };
    }

    //
    //
    //
    function sun(weather) {

        var hhmm,
            sr,
            ss,
            dayLenght,
            dayLenghtDiff = '';

        hhmm = astro.sec2HhMm(weather.sun.rise);
        sr = utils.fillTemplates(i18n.__('sunrise'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.sun.set);
        ss = utils.fillTemplates(i18n.__('sunset'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.sun.dayLength);
        dayLenght = utils.fillTemplates(i18n.__('dayLenght'), {
            hours : hhmm.hour,
            min : hhmm.min
        });

        return {
            sr : sr,
            ss : ss,
            dayLenght : dayLenght,
            dayLenghtDiff : ''
        };
    }

    //
    //
    //
    function weekdays(weather) {

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        var duration = moment.duration({'days' : 1}),
            date = weather.date, // || 1364595184 * 1000,  // 29.März 2013 23:15
            tomorrow = i18n.__('tomorrow');

        if ((tomorrow === '') || (tomorrow === null)) {
            tomorrow = moment(date).add(duration).format('dddd');
        }

        return {
            tomorrow : tomorrow,
            day_after_tomorrow : moment(date).add(duration).add(duration).format('dddd'),
            day_after_tomorrow_plusOne : moment(date).add(duration).add(duration).add(duration).format('dddd')
        };

    }

    //
    //
    //
    function footer(weather) {

        var dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        return moment(weather.lastObservation).format(dateFormatStr);
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

    function Localizer(config) {

        i18n = config.i18n;
        this.localesMap = config.localesMap;

        applyPatch_de();

    }

    /** 
     * Localizes for the given `weather` data.
     *
     * @ param {weather} Object 
     * @ param {isoLocale} Object - comes from `app-config.js`
     * @ param {device} String - for the css-file name
     *
     * @api public
     */

    localizer = function (i18n, localesMap) {
        return new Localizer({
            i18n : i18n,
            localesMap : localesMap
        });

    };

    ///////////////////////////////////////////////////////////////////////////

    Localizer.prototype = {

        /** 
         * Localizes for the given `weather` data.
         *
         * @ param {weather} Object 
         * @ param {params} Object
         * @ param {cb} Function
         *
         * @api public
         */

        localize : function (weather, params) {

            var lang = params.lang.toLowerCase(),
                // 'moment' doesn't conforms with the ISO 3166-2
                mappedLang = this.localesMap[lang];

            if (mappedLang === undefined) {
                // there wasn't any mappings declared,
                // so use the original lang/country
                mappedLang = lang;
            }

            i18n.setLocale(mappedLang);
            moment().lang(mappedLang);

            return {
                common : commons(weather),
                header : header(weather),
                sun : sun(weather),
                weekdays : weekdays(weather),
                footer : footer(weather)
            };

        }

    };

    /**
     * Expose `localizer`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = localizer;
    }

}).call(this);