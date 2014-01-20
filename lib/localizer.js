/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

/*!
 * localizer
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

 // https://developers.google.com/closure/compiler/?csw=1

/**
 * Application prototype.
 */

var localizer = {};

module.exports = localizer;

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
        tu = this.i18n.__('tempUnit').split('_'),

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

};

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

    var self = this,
        w = p.weather,
        l = p.localized,
        fc = w.forecastday[dayNum],
        result = {
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
        return utils.fillTemplates(self.i18n.__(eventName), {
            min : ev.mm,
            hour : ev.hh
        });
    }

    // default : hasSun = false
    if (hasSun !== undefined && hasSun === true) {

        result.sun = {
            sr : localizeSunEvent(fc.sun.sunrise, 'sunrise'),
            ss : localizeSunEvent(fc.sun.sunset, 'sunset'),
            dl : localizeSunEvent(fc.sun.daylength, 'dayLenght'),
            dld : utils.fillTemplates(this.i18n.__('dayLenghtDiff'), {
                min : astro.formatDayLengthDiff(fc.sun.dld)
            })
        };

    }

    return result;

};

//
// @param {wfo} Object - the workflow object
//
localizer.dayZero = function (p, dayNum) {

    var w = p.weather,
        l = p.localized,
        m = moment(w.forecastday[dayNum].epoch);

    // 29 Mar
    l.header.date = m.format(utils.fillTemplates(this.i18n.__('currDate'), {
        day: 'D',
        month: 'MMM'
    }));
    // 88. day of year
    l.header.doy = utils.fillTemplates(this.i18n.__('dayOfYear'), {
        doy: m.dayOfYear()
    });

    l.header.forecast = this.createForecast(p, dayNum, true);

    return p;

};

//
// @param {wfo} Object - the workflow object
//
localizer.dayZero = function (p, dayNum) {

    var w = p.weather,
        h = p.localized.header,
        m = moment(w.forecastday[dayNum].epoch);


    // 29 Mar
    h.date = m.format(utils.fillTemplates(this.i18n.__('currDate'), {
        day: 'D',
        month: 'MMM'
    }));
    // 88. day of year
    h.doy = utils.fillTemplates(this.i18n.__('dayOfYear'), {
        doy: m.dayOfYear()
    });

    h.forecast = this.createForecast(p, dayNum, true);

    return p;

};

//
// @param {wfo} Object - the workflow object
//
localizer.footer = function (p) {

    var w = p.weather,
        l = p.localized,
        s = utils.fillTemplates(this.i18n.__('observationTime'), {
            day: 'DD',
            month: 'MMM',
            hour: 'HH',
            min: 'mm',
            timezone: 'Z'
        });

    l.footer = moment(w.lastObservation).format(s);

    return p;
};
