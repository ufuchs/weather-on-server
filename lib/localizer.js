/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

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
 * Dependencies
 */

var moment = require('moment'),
    when = require('when'),
    locales = require('./../locales/locales.js').locales,
    I18n = require('i18n-2'),
    utils = require('./utils.js'),
    astro = require('./astro.js');

(function () {

    'use strict';

    var localizer,
        kindle4ntLocalizer,
        df3120Localizer,
        extend = utils.extend,
        i18n = new I18n(locales.i18n);

    //
    //
    // @api private
    function localizeSun(time, event) {
        return utils.fillTemplates(i18n.__(event), {
            min : time.mm,
            hour : time.hh
        });
    }

    //
    //
    // @api private
    function createSun(fc) {
        return {
            sr : localizeSun(fc.sun.sunrise, 'sunrise'),
            ss : localizeSun(fc.sun.sunset, 'sunset'),
            dl : localizeSun(fc.sun.daylength, 'dayLenght'),
            dld : utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                min : astro.formatDayLengthDiff(fc.sun.dld)
            })
        };
    }

    localizer = {

        prepare4Lang : function (wfo, isoLang) {

            var c = wfo.localized.common,
                d = wfo.weather.date,
                t = i18n.__('tempUnit').split('_'),

                // Adding a duration of one day instead of only 24h is necessary.
                // caused by the two switches from winter to summer time and back again.
                // Otherwise the wrong day name will be displayed...
                duration = moment.duration({'days' : 1});

            i18n.setLocale(isoLang);
            // 'moment' doesn't conforms with the ISO 3166-2
            moment.lang(isoLang);

            c.tempUnit = t[0];
            c.tempUnitToDisplay = t[1];
            c.min = i18n.__('minimal');
            c.max = i18n.__('maximal');

            c.dayNames = [
                i18n.__('today') || moment(d).format('dddd'),
                i18n.__('tomorrow') || moment(d).add(duration).format('dddd'),
                moment(d).add(duration).add(duration).format('dddd'),
                moment(d).add(duration).add(duration).add(duration).format('dddd')
            ];

            return wfo;

        },

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
        createForecast : function (p, dayNum, hasSun) {

            var w = p.weather,
                c = p.localized.common,
                fc = w.forecastday[dayNum];

            return {
                name : c.dayNames[dayNum],
                sun : (hasSun === true && createSun(fc)) || {},
                temp : {
                    high : fc.temp.high[c.tempUnit],
                    low : fc.temp.low[c.tempUnit]
                },
                ic : fc.ic,
                sic : fc.sic
            };

        },

        dayZero : function (p, dayNum) {

            var w = p.weather,
                h = p.localized.header,
                m = moment(w.forecastday[dayNum].epoch);

            // 29 Mar
            h.date = m.format(utils.fillTemplates(i18n.__('currDate'), {
                day: 'D',
                month: 'MMM'
            }));
            // 88. day of year
            h.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
                doy: m.dayOfYear()
            });

            h.forecast = this.createForecast(p, dayNum, true);

            return p;

        },

        footer : function (p) {

            var s = utils.fillTemplates(i18n.__('observationTime'), {
                    day: 'DD',
                    month: 'MMM',
                    hour: 'HH',
                    min: 'mm',
                    timezone: 'Z'
                });

            p.localized.footer = moment(p.weather.lastObservation).format(s);

            return p;
        }

    };

    /************************************
        Kindle 4 NT
    ************************************/

    kindle4ntLocalizer = {

        forecasts : function (p) {
            return when.join(
                this.createForecast(p, 1),
                this.createForecast(p, 2),
                this.createForecast(p, 3)
            )
                .then(function (day) {
                    p.localized.forecastday = day;
                    return p;
                });
        },

        localize : function (wfo, dayNum) {
            return when(this.dayZero({weather : wfo.weather, localized : wfo.localized}, dayNum || 0))
                .then(this.forecasts.bind(this))
                .then(this.footer)
                .then(function () {
                    return wfo;
                }, function (err) {
                    console.log(err);
                });
        }

    };

    /************************************
        DF 3120
    ************************************/

    df3120Localizer = {

        localize : function (wfo, dayNum) {

            return when(this.dayZero({weather : wfo.weather, localized : wfo.localized}, dayNum || 0))
                .then(this.footer)
                .then(function () {
                    return wfo;
                }, function (err) {
                    console.log(err);
                });

        }

    };

    /**
     * Expose `localizer`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {

        module.exports = {
            kindle4nt : extend(kindle4ntLocalizer, localizer),
            df3120 : extend(df3120Localizer, localizer)
        };

    }

}());
