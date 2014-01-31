/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * svgEngine
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

    var svgEngine,
        i18n = new I18n(locales.i18n);

    svgEngine = {

        populateSvgTemplate : function (wfo, dayNum) {

            var l = wfo.localized,
                c = wfo.cfg,
                fc = wfo.localized.forecast,
                singleDayDisplay = wfo.cfg.singleDayDisplay,
                // get a copy from the origin
                copied = c.svgTemplate.substr(0, c.svgTemplate.length + 1);

            dayNum = !singleDayDisplay
                ? dayNum || 0
                : dayNum;

            wfo.svg[dayNum] = utils.fillTemplates(copied, {

                css : c.svg.cssFile,

                // common
                tempUnit : l.common.tempUnitToDisplay,
                min : l.common.min,
                max : l.common.max,

                // header
                date : fc[dayNum].date,
                doy : fc[dayNum].doy,

                // header/sun
                sr : fc[dayNum].sun.sr,
                ss : fc[dayNum].sun.ss,
                dl : fc[dayNum].sun.dl + '   ' + fc[0].sun.dld,

                // header/forecast
                dow0 : fc[dayNum].dayName,
                h0 : fc[dayNum].temp.high,
                l0: fc[dayNum].temp.low,
                ic0 : fc[dayNum].ic,

                // footer/last observation time
                update : l.observationFrom

            });

            if (!singleDayDisplay) {

                wfo.svg[dayNum] = utils.fillTemplates(wfo.svg[dayNum], {

                    // tomorrow
                    dow1 : fc[1].dayName,
                    h1 : fc[1].temp.high,
                    l1 : fc[1].temp.low,
                    ic1 : fc[1].ic,

                    // day after tomorrow
                    dow2 : fc[2].dayName,
                    h2 : fc[2].temp.high,
                    l2 : fc[2].temp.low,
                    ic2 : fc[2].ic,

                    // day after tommorow + 1
                    dow3 : fc[3].dayName,
                    h3 : fc[3].temp.high,
                    l3 : fc[3].temp.low,
                    ic3 : fc[3].ic,

                });

            }

            return wfo;

        },

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
        createForecast : function (p, dayNum, singleDayDisplay) {

            var w = p.weather,
                c = p.localized.common,
                fc = w.forecastday[dayNum],
                m = moment(fc.epoch),
                extras = !singleDayDisplay || dayNum > 0,
                result;

            function date() {
                return m.format(utils.fillTemplates(i18n.__('currDate'), {
                    day: 'D',
                    month: 'MMM'
                }));
            }

            function doy() {
                return utils.fillTemplates(i18n.__('dayOfYear'), {
                    doy: m.dayOfYear()
                });
            }

            function createSun(fc) {

                function localizeSun(time, event) {
                    return utils.fillTemplates(i18n.__(event), {
                        min : time.mm,
                        hour : time.hh
                    });
                }

                return {
                    sr : localizeSun(fc.sun.sunrise, 'sunrise'),
                    ss : localizeSun(fc.sun.sunset, 'sunset'),
                    dl : localizeSun(fc.sun.daylength, 'dayLenght'),
                    dld : utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                        min : astro.formatDayLengthDiff(fc.sun.dld)
                    })
                };
            }

            result = {
                dayName : c.dayNames[dayNum],
                temp : {
                    high : fc.temp.high[c.tempUnit],
                    low : fc.temp.low[c.tempUnit]
                },
                ic : fc.ic,
                sic : fc.sic
            };

            if (extras) {
                // 29 Mar
                result.date = date();
                // 88. day of year
                result.doy = doy();
                result.sun = createSun(fc);
            }

            return result;

        },

        //
        //
        //
        localize : function (wfo) {

            var p = {weather : wfo.weather, localized : wfo.localized},
                w = wfo.weather,
                l = wfo.localized,
                singleDayDisplay = wfo.cfg.singleDayDisplay,
                s = utils.fillTemplates(i18n.__('observationTime'), {
                    day: 'DD',
                    month: 'MMM',
                    hour: 'HH',
                    min: 'mm',
                    timezone: 'Z'
                });

            l.observationFrom = moment(w.lastObservation).format(s);

            return when.all([
                this.createForecast(p, 0, singleDayDisplay),
                this.createForecast(p, 1, singleDayDisplay),
                this.createForecast(p, 2, singleDayDisplay),
                this.createForecast(p, 3, singleDayDisplay)]
                )
                .then(function (day) {
                    l.forecast  = day;
                    return wfo;
                });

        }

    };

    /**
     * Expose `svgEngine`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = svgEngine;
    }

}());
