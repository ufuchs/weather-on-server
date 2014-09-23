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
    locales = require('./../locales/locales.js').locales,
    I18n = require('i18n-2'),
    svg2png = require('./svg2png/svg2png.js'),
    FS = require('fs.extra'),
    path = require('path'),
    appCfg = require('./../weather-config.js'),
    Q = require('q'),
    utils = require('./utils.js');


(function () {

    'use strict';

    var svgEngine,
        i18n = new I18n(locales.i18n),
        provider,
        configurator = {};

    // Gets the string representation of a 2-digit number with leading zero
    // @param {num} Integer - Number to convert
    // @return String - String representation with leading zero
    // @api : private
    function leadingZero(num) {
        // see http://jsperf.com/left-zero-filling for performance comparison
        var s = num + '';
        return s.length === 2 ? s : '0' + s;
    }

    // Gets the string representation of a 2-digit number with leading zero
    // @param {num} Integer - Number to convert
    // @return String - String representation with leading zero
    // @api : private
    function formatDayLengthDiff(hhmmss) {
        return (hhmmss.mm * hhmmss.sign) + ':' + leadingZero(hhmmss.ss);
    }

    /************************************
        configurator
    ************************************/

    /**
     * Configures a new workflow object
     *
     * @param {location} Object - comes from the request
     * @return Object - the configured workflow object
     *
     * @api public
     */

    configurator.configure = function (wfo) {

        var r = wfo.cfg.request,
            d = wfo.cfg.display = appCfg.getDisplay(r.device),
            targetDir = appCfg.getTargetDir(r.device, r.id.toString());

        function loadSvgTemplate(filename) {
            return utils.readTextFileW(filename)
                .then(function (svgTemplate) {
                    wfo.cfg.svgTemplate = svgTemplate;
                    return wfo;
                });
        }

        // Look at a language specific css file like 'ru-kindle4nt'
        function getCssFilename(wfo) {

            var deviceDir = appCfg.getDeviceDir(r.device),
                cssFile = r.device + '.css',
                cssFile_LangSpecific = r.lang + '-' + cssFile,
                deferred = Q.defer();

            // VOR VERLAGERN
            FS.exists(path.join(deviceDir, cssFile_LangSpecific), function (exists) {
                if (exists) {
                    d.cssFile = cssFile_LangSpecific;
                } else {
                    d.cssFile = cssFile;
                }
                deferred.resolve(wfo);
            });

            return deferred.promise;

        }

        function makeTargetDir(wfo) {
            return utils.mkdirW(targetDir)
                .then(function () {
                    return wfo;
                });
        }

        d.baseFilename = path.join(targetDir, appCfg.getPngFilename());

        return loadSvgTemplate(appCfg.getSvgTemplate(r.device))
            .then(getCssFilename)
            .then(makeTargetDir);

    };

    /************************************
        svgEngine
    ************************************/

    svgEngine = {

        provider : null,

        populateSvgTemplate : function (wfo, dayNum) {

            var l = wfo.localized,
                c = wfo.cfg,
                fc = wfo.localized.forecast,
                d = wfo.cfg.display,
                replaceSet;

            function getForecasts() {

                var result;

                if (d.singleDayDisplay) {
                    result = [ {
                        dow: fc[dayNum].dayName,
                        h: fc[dayNum].temp.high,
                        l: fc[dayNum].temp.low,
                        ic: fc[dayNum].ic
                    } ];
                } else {
                    result = fc.map(function (forecast) {
                        return {
                            dow: forecast.dayName,
                            h: forecast.temp.high,
                            l: forecast.temp.low,
                            ic: forecast.ic
                        };
                    });
                }

                return result;

            }

            replaceSet = {

                css : d.cssFile,

                // common
                tempUnit : l.common.tempUnitToDisplay,
                min : l.common.min,
                max : l.common.max,

                // header
                date : fc[dayNum].date,
                doy : fc[dayNum].doy,

                // sun
                sr : fc[dayNum].sun.sr,
                ss : fc[dayNum].sun.ss,
                dl : fc[dayNum].sun.dl + '   ' + fc[0].sun.dld,

                // footer/last observation time
                update : l.observationFrom,

                days: getForecasts()

            };

            wfo.svg[dayNum] = utils.fillTemplates(c.svgTemplate, replaceSet);

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
                extras = (!singleDayDisplay || dayNum > 0) || singleDayDisplay,
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
                        min : leadingZero(time.mm),
                        hour : leadingZero(time.hh)
                    });
                }

                return {
                    sr : localizeSun(fc.sun.rise, 'sunrise'),
                    ss : localizeSun(fc.sun.set, 'sunset'),
                    dl : localizeSun(fc.sun.dayLength, 'dayLenght'),
                    dld : utils.fillTemplates(i18n.__('dayLenghtDiff'), {
                        min : formatDayLengthDiff(fc.sun.dayLengthDiff)
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
                d = wfo.cfg.display,
                s = utils.fillTemplates(i18n.__('observationTime'), {
                    day: 'DD',
                    month: 'MMM',
                    hour: 'HH',
                    min: 'mm',
                    timezone: 'Z'
                }),
                arr = [],
                i,
                maxForecastDays = d.maxForecastDays > w.maxForecasts
                    ? w.maxForecasts
                    : d.maxForecastDays;

            l.observationFrom = moment(w.lastObservation).format(s);

            for (i = 0; i < maxForecastDays; i += 1) {
                arr.push(Q.when(this.createForecast(p, i, d.singleDayDisplay)));
            }

            return Q.all(arr)
                .then(function (forecast) {
                    l.forecast  = forecast;
                    return wfo;
                });

        },

        //
        //
        //
        render : function (wfo) {

            var d = wfo.cfg.display,
                dayNum = wfo.cfg.request.period;

            return svg2png.renderSvgFromStream({
                svg : wfo.svg[dayNum],
                dayNum : dayNum,
                crushed : d.crushed,
                singleDayDisplay : d.singleDayDisplay,
                baseFilename : d.baseFilename
            });

        },

        prepare : function (aProvider) {
            provider = aProvider;
        },

        //
        //
        //
        process : function (config) {

            var dayNum = config.request.period,
                isoLang = locales.mapIsoToI18n(config.request.lang),
                wfo = utils.createWfo(config);

            return Q.when(configurator.configure(wfo))
                .then(provider.extract.bind(provider, wfo))
                .then(svgEngine.prepare4Lang.bind(svgEngine, wfo, isoLang))
                .then(svgEngine.localize.bind(svgEngine))
                .then(svgEngine.populateSvgTemplate.bind(svgEngine, wfo, dayNum))
                .then(svgEngine.render.bind(svgEngine));

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
