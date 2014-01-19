/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * localizer
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ It is better to be beautiful than to be good.                          ]
 * [ But... it is better to be good than to be ugly.         - Oscar Wilde -]
 */

/**
 * Application prototype.
 */

var localizer = exports = module.exports = {};

var moment = require('moment'),
    I18n = require('i18n-2'),
    fn = require("when/function"),
    when = require('when'),
    utils = require('./utils.js'),
    astro = require('./astro.js');

//
//
//
localizer.init = function (locales) {
    this.i18n = new I18n(locales.i18n);
};

//
//
//
localizer.prepare = function (wfo, isoLang) {

    var l = wfo.localized,
        w = wfo.weather,
        tu = i18n.__('tempUnit').split('_'),

        // Adding a duration of one day instead of only 24h is necessary.
        // caused by the two switches from winter to summer time and back again.
        // Otherwise the wrong day name will be displayed...
        duration = moment.duration({'days' : 1});

    this.i18n.setLocale(isoLang);
    // 'moment' doesn't conforms with the ISO 3166-2
    moment.lang(isoLang);

    l.common.tempUnit = tu[0];
    l.common.tempUnitToDisplay = tu[1];
    l.common.min = this.i18n.__('minimal');
    l.common.max = this.i18n.__('maximal');

    l.common.dayNames = [
        this.i18n.__('today') || moment(w.date).format('dddd'),
        this.i18n.__('tomorrow') || moment(w.date).add(duration).format('dddd'),
        moment(w.date).add(duration).add(duration).format('dddd'),
        moment(w.date).add(duration).add(duration).add(duration).format('dddd')
    ];

    return wfo;

}

//
// @param {wfo} Object - the workflow object
//
localizer.dayZero = function (p, dayNum) {

    var w = p.weather,
        l = p.localized,
        m = moment(w.forecastday[dayNum].epoch);

    // 29 Mar
    l.header.date = m.format(utils.fillTemplates(i18n.__('currDate'), {
        day: 'D',
        month: 'MMM'
    }));
    // 88. day of year
    l.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
        doy: m.dayOfYear()
    });

    l.header.forecast = createForecast(p, dayNum, true);

    return p;

}


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
localizer.createForecast = function (p, dayNum, hasSun) {

    var w = p.weather,
        l = p.localized,
        fc = w.forecastday[dayNum],
        forecast = {
            name : l.common.dayNames[dayNum],
            temp : {
                high : fc.temp.high[l.common.tempUnit],
                low : fc.temp.low[l.common.tempUnit]
            },
            ic : fc.ic,
            sic : fc.sic
        };

    //
    //
    //
    function localizeSunEvent(ev, eventName) {
        return utils.fillTemplates(i18n.__(eventName), {
            min : ev.mm,
            hour : ev.hh
        });
    }

    // default : hasSun = false
    if (hasSun !== undefined && hasSun === true) {

        forecast.sun = {
            sr : localizeSunEvent(fc.sun.sunrise, 'sunrise'),
            ss : localizeSunEvent(fc.sun.sunset, 'sunset'),
            dl : localizeSunEvent(fc.sun.daylength, 'dayLenght'),
            dld : utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                min : astro.formatDayLengthDiff(fc.sun.dld)
            })
        };

    }

    return forecast;

}

//
// @param {wfo} Object - the workflow object
//
localizer.dayZero = function (p, dayNum) {

    var w = p.weather,
        l = p.localized,
        m = moment(w.forecastday[dayNum].epoch);


    console.log(JSON.stringify(w));

    // 29 Mar
    l.header.date = m.format(utils.fillTemplates(i18n.__('currDate'), {
        day: 'D',
        month: 'MMM'
    }));
    // 88. day of year
    l.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
        doy: m.dayOfYear()
    });

    l.header.forecast = createForecast(p, dayNum, true);

    return p;

}

