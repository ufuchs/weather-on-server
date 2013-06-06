/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * i18n
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var CFG = require('./../app-config.js'),
    fs = require('fs.extra'),
    moment = require('moment'),
    utils = require('./utils.js'),
    astro = require('../astronomy/utils.js'),
    I18n2 = require('i18n-2');


/**
 * Expose `Kindel4NtRenderStrategy`.
 */

exports = module.exports = I18n;

/** 
 * Initialize a new `I18n` with a given locale.
 *
 * @api public
 */

function I18n(locales, localesMap) {

    this.i18n = new I18n2(locales);
    this.localesMap = localesMap;

}

/** 
 * Sets a new `isoLocale` object on run time.
 *
 * @param {isoLocale} String
 * @api public
 */

I18n.prototype.setLocale = function (isoLocale) {

    var mappedLocale = this.localesMap[isoLocale];

    this.i18n.setLocale(mappedLocale);
    moment().lang(mappedLocale);

};

//
//
//
I18n.prototype.getCommons = function (weather) {

    var str,
        tempUnit,
        tempUnitToDisplay,
        min,
        max;


    str = this.i18n.__('tempUnit').split('_');

    tempUnit = str[0];

    tempUnitToDisplay = str[1];

    min = this.i18n.__('minimal');

    max = this.i18n.__('maximal');

    return {
        tempUnit : tempUnit,
        tempUnitToDisplay : tempUnitToDisplay,
        min : min,
        max : max
    };


};

/** 
 * Formats the header:
 * 'Today 29 Mar/88. day of year'
 *
 * 
 * @param {weather} Object
 * @api public
 */

I18n.prototype.getHeader = function (weather) {

    var today = this.i18n.__('today'),
        dateFormatStr = utils.fillTemplates(this.i18n.__('currDate'), {
            day: 'DD',
            month: 'MMM'
        }),
        date,
        doy;

    if ((today === '') || (today === null)) {
        today = moment(weather.date).format('dddd');
    }

    // 29 Mar
    date = moment(weather.date).format(dateFormatStr);

    // 88. day of year
    doy = utils.fillTemplates(this.i18n.__('dayOfYear'), {
        doy: moment(weather.date).dayOfYear()
    });

    return {
        today : today,
        date : date,
        doy : doy
    };

};

//
//
//
I18n.prototype.getSun = function (weather) {


    var hhmm,
        sr,
        ss,
        dayLenght,
        dayLenghtDiff;

    hhmm = astro.sec2HhMm(weather.sr);
    sr = utils.fillTemplates(this.i18n.__('sunrise'), {
        hour : hhmm.hour,
        min : hhmm.min
    });

    hhmm = astro.sec2HhMm(weather.ss);
    ss = utils.fillTemplates(this.i18n.__('sunset'), {
        hour : hhmm.hour,
        min : hhmm.min
    });

    hhmm = astro.sec2HhMm(weather.dl);
    dayLenght = utils.fillTemplates(this.i18n.__('dayLenght'), {
        hours : hhmm.hour,
        min : hhmm.min
    });

    dayLenghtDiff = '';

    return {
        sr : sr,
        ss : ss,
        dayLenght : dayLenght,
        dayLenghtDiff : dayLenghtDiff
    };

}

//
//
//
I18n.prototype.getWeekdays = function (weather) {

    var duration = moment.duration({'days' : 1}),
        tomorrow = this.i18n.__('tomorrow'),
        day_after_tomorrow,
        day_after_tomorrow_plusOne;

    if ((tomorrow === '') || (tomorrow === null)) {
        tomorrow = moment(weather.date).add(duration).format('dddd');
    }

    day_after_tomorrow = moment(weather.date).add(duration).add(duration);
    day_after_tomorrow_plusOne = moment(weather.date).add(duration).add(duration).add(duration);

    return {
        tomorrow : tomorrow,
        day_after_tomorrow : day_after_tomorrow.format('dddd'),
        day_after_tomorrow_plusOne : day_after_tomorrow_plusOne.format('dddd')
    };

};

//
//
//
I18n.prototype.getFooter = function (weather) {

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

    var dateFormatStr = utils.fillTemplates(this.i18n.__('observationTime'), {
            day: 'DD',
            month: 'MMM',
            hour: 'HH',
            min: 'mm',
            timezone: 'Z'
        }),
        date = moment(weather.lastObservation).format(dateFormatStr);

    return date;

};

// Gets the css-file name for a given `device` and `lang`.
// Returns the css-file name which is related to the `lang',
// otherwise the default css-file name
//
// @param {device} String
// @param {lang} String
// @return String
I18n.prototype.getCssFileName = function (device, lang, callback) {

    var deviceCssPath = CFG.svgPool.dir + '/' + device,
        file,
        fileLang,
        i;

    fs.readdir(deviceCssPath, function (err, files) {

        i = files.indexOf('app-dir');

        files.splice(i, 1);

        for (i = 0; i < files.length; i += 1) {

            file = files[i];

            fileLang = files[i].substr(0, file.indexOf('-'));

            if (fileLang === lang) {
                callback(file);
                return;
            }

        }

        callback(device + '.css');

    });

};

//
//
//
I18n.prototype.applyPatch = function () {

    if (moment.lang() === 'de') {
        // http://www.duden.de/suchen/dudenonline/Monat
        // the original `_monthsShort` doesn't conforms with the german 'DUDEN'. 
        moment().lang()._monthsShort = "Jan._Febr._März_Apr._Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split('_');
    }

}
