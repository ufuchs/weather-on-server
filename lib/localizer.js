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
    fs = require('fs.extra'),
    CFG = require('./../app-config.js'),
    astro = require('./../astronomy/utils.js');

(function (undefined) {

    var localizer,

        i18n,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),


        result = {

            common : {
                tempUnit : null,
                tempUnitToDisplay : null,
                min : null,
                max : null
            },

            header : {
                today : null,
                date : null,
                doy : null
            },

            sun : {
                sr : null,
                ss : null,
                dayLenght : null,
                dayLenghtDiff : null
            },

            weekdays : {
                tomorrow : null,
                day_after_tomorrow : null,
                day_after_tomorrow_plusOne : null
            },

            footer : null
        };

    //
    //
    //
    function commons(weather, cb) {

        var str;

        str = i18n.__('tempUnit').split('_');

        result.common.tempUnit = str[0];

        result.common.tempUnitToDisplay = str[1];

        result.common.min = i18n.__('minimal');

        result.common.max = i18n.__('maximal');

        cb();

    }

    //
    //
    //
    function header(weather, cb) {

        var today = i18n.__('today'),
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            date,
            doy;

        if ((today === '') || (today === null)) {
            today = moment(weather.date).format('dddd');
        }

        result.header.today = today;

        // 29 Mar
        result.header.date = moment(weather.date).format(dateFormatStr);

        // 88. day of year
        result.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
            doy: moment(weather.date).dayOfYear()
        });

        cb();
    }

    //
    //
    //
    function sun(weather, cb) {

        var hhmm;

        hhmm = astro.sec2HhMm(weather.sr);
        result.sun.sr = utils.fillTemplates(i18n.__('sunrise'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.ss);
        result.sun.ss = utils.fillTemplates(i18n.__('sunset'), {
            hour : hhmm.hour,
            min : hhmm.min
        });

        hhmm = astro.sec2HhMm(weather.dl);
        result.sun.dayLenght = utils.fillTemplates(i18n.__('dayLenght'), {
            hours : hhmm.hour,
            min : hhmm.min
        });

        result.sun.dayLenghtDiff = '';

        cb();
    }

    //
    //
    //
    function weekdays(weather, cb) {

        var duration = moment.duration({'days' : 1}),
            tomorrow = i18n.__('tomorrow');

        if ((tomorrow === '') || (tomorrow === null)) {
            tomorrow = moment(weather.date).add(duration).format('dddd');
        }

        result.weekdays.tomorrow = tomorrow;
        result.weekdays.day_after_tomorrow = moment(weather.date).add(duration).add(duration).format('dddd');
        result.weekdays.day_after_tomorrow_plusOne = moment(weather.date).add(duration).add(duration).add(duration).format('dddd');

        cb();
    }

    //
    //
    //
    function footer(weather, cb) {

        /*
        "observation_time":"Last Updated on Januar 31, 22:13 CET",
        "observation_time_rfc822":"Thu, 31 Jan 2013 22:13:09 +0100",
        "observation_epoch":"1359666789",
        "local_time_rfc822":"Thu, 31 Jan 2013 22:22:07 +0100",
        "local_epoch":"1359667327",
        "local_tz_short":"CET",
        "local_tz_long":"Europe/Berlin",
        "local_tz_offset":"+0100",
        */

        var dateFormatStr = utils.fillTemplates(i18n.__('observationTime'), {
                day: 'DD',
                month: 'MMM',
                hour: 'HH',
                min: 'mm',
                timezone: 'Z'
            });

        result.footer = moment(weather.lastObservation).format(dateFormatStr);

        cb();
    }

    //
    //
    //
    function applyPatch_de() {

        var defLang = moment.lang();

        moment().lang('de');

        // http://www.duden.de/suchen/dudenonline/Monat
        // the original `_monthsShort` doesn't conforms with the german 'DUDEN'. 
        moment().lang()._monthsShort = "Jan._Febr._März_Apr._Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split('_');

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
     *
     * @api private
     */

    function makeLocalizer(config) {
        return new Localizer(config);
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
        return makeLocalizer({
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
         * @ param {isoLocale} Object - comes from `app-config.js`
         * @ param {device} String - for the css-file name
         *
         * @api public
         */

        localize : function (weather, params, cb) {

            var locale = this.localesMap[params.lang.toLowerCase()];

            i18n.setLocale(locale);
            moment().lang(locale);

            commons(weather, function () {
                header(weather, function () {
                    sun(weather, function () {
                        weekdays(weather, function () {
                            footer(weather, function () {
                                cb(result);
                            });
                        });
                    });
                });
            });

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