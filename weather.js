/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weather
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

/**
 * Dependencies
 */

var fs = require('fs.extra'),
    path = require('path'),
    moment = require('moment'),
    request = require('request'),
    when = require('when'),
    nodefn = require("when/node/function"),
    fn   = require("when/function"),
    callbacks   = require("when/callbacks"),

    wunderground = require('./lib/provider/wunderground.js'),
    cfg = require('./weather-config.js'),
    localizer = require('./lib/localizer.js'),
    filenames = require('./lib/filenames.js'),
    utils = require('./lib/utils.js'),
    renderService = require('./lib/svg2png-renderer.js');



(function () {

    var weather,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        production = {
            df3120 : {
                /* example of the structure of property
                '1' : {
                    expires : undefined,
                    filenames : undefined

                }
                */
            },
            kindle4nt : {
            }
        };

    //
    //
    //
    function populateSvgTemplate(params) {

        var svgTemplate,
            svg,
            localize = nodefn.lift(localizer.localize),
            deferred = when.defer();

//        console.log(params);

        callbacks.call(utils.readTextFile, params.filenames['in'].svgTemplate)
            .then(function (template) {
                svgTemplate = template;
                return params;
            })
            .then(localize)
            .then(function (localized, cb) {

//                console.log(localized);

                deferred.resolve({
                    filenames : params.filenames,
                    location : params.location,
                    svg : utils.fillTemplates(svgTemplate, {

                        // common
                        css : params.filenames['in'].cssFile,
                        tempUnit : localized.common.tempUnitToDisplay,
                        min : localized.common.min,
                        max : localized.common.max,

                        // header
                        date : localized.header.date,
                        doy : localized.header.doy,
                        dow0 : localized.header.forecast.name,
                        // header/sun
                        sr : localized.header.sun.sr,
                        ss : localized.header.sun.ss,
                        dl : localized.header.sun.dl + '   ' + localized.header.sun.dld,
                        // header/forecast
                        h0 : localized.header.forecast.temp.high,
                        l0: localized.header.forecast.temp.low,
                        ic0 : localized.header.forecast.ic,

                        // tomorrow
                        dow1 : localized.forecastday[1].name,
                        h1 : localized.forecastday[1].temp.high,
                        l1 : localized.forecastday[1].temp.low,
                        ic1 : localized.forecastday[1].ic,

                        // day after tomorrow
                        dow2 : localized.forecastday[2].name,
                        h2 : localized.forecastday[2].temp.high,
                        l2 : localized.forecastday[2].temp.low,
                        ic2 : localized.forecastday[2].ic,

                        // // day after tommorow + 1
                        dow3 : localized.forecastday[3].name,
                        h3 : localized.forecastday[3].temp.high,
                        l3 : localized.forecastday[3].temp.low,
                        ic3 : localized.forecastday[3].ic,

                        // footer
                        update : localized.footer

                    })

                });

            });

        return deferred.promise;

    }

    //
    //
    //
    function writeResults(params, cb) {

        fs.writeFile(params.filenames.out.weatherSvg, params.svg, function (err) {

            if (err) {
                cb(err, null);
                return;
            }

            renderService.render({device : params.location.device, out : params.filenames.out}, function (err, outPng) {
                cb(err, outPng);
            });

        });

    }

    //
    //
    //
    function prepareTargetDir(params, cb) {

        var targetDir = params.filenames.out.targetDir;

        fs.exists(targetDir, function (exists) {

            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                });
            }

            cb(null, params);

        });

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Download weather data from provider and transforms it into a PNG file
     *
     * @param {proxy} String
     * @param {apikey} String
     * @param {cachettl} Integer
     *
     * @api public
     */

    weather = function (proxy, apikey, cachettl) {

        wunderground(proxy, apikey, cachettl);
        localizer(cfg);
        filenames(cfg);

    };

    //
    //
    //
    function processWeather4Device(params, cb) {

        var writeRes = nodefn.lift(writeResults);

        populateSvgTemplate(params)
            .then(writeRes)
            .then(function (filename, err) {
                cb(err, filename);
            });

    }

    //
    //
    //
    function adjustParams(params, period) {

        var filenames = params.filenames.out,
            weatherSvg,
            unweatherPng,
            weatherPng;

        if (params.location.device !== 'kindle4nt') {

            params.location.period = period;

            weatherSvg = utils.numberedFilename(filenames.weatherSvg, period);
            unweatherPng = utils.numberedFilename(filenames.unweatherPng, period);
            weatherPng = utils.numberedFilename(filenames.weatherPng, period);

            params.filenames.out.weatherSvg = weatherSvg;
            params.filenames.out.unweatherPng = unweatherPng;
            params.filenames.out.weatherPng = weatherPng;

        }

        return params;

    }

    //
    //
    //
    function processWeatherdata(params, cb) {

        var period = 0,
            maxFiles = cfg.production.files.quantity[params.location.device],
            files = [],
            orgPeriod = params.location.period,
            expires;

        function process(period) {

            if (period < maxFiles) {

                adjustParams(params, period);

                processWeather4Device(params, function (err, filename) {

                    if (err) {
                        cb(err, null);
                    } else {

                        files.push(filename);

                        if (period === 0) {

                            fs.stat(filename, function (err, stats) {
                                expires = stats.mtime.getTime()  + cfg.production.expires * 1000;
                                process(period + 1);

                            });

                        } else {
                            process(period + 1);
                        }

                    }

                });

            } else {

                params.location.period = orgPeriod;
                production[params.location.device][String(params.location.id)] = {
                    expires : expires,
                    pretty : new Date(expires),
                    filenames : files
                };

                cb(null, files);

                return;

            }
        }

        process(0);

    }

    ///////////////////////////////////////////////////////////////////////////

    //
    //
    //
    weather.main = function (location, cb) {

        var getWeather = nodefn.lift(wunderground.getWeather),
            processWeather = nodefn.lift(processWeatherdata),
            getFilenamesFor = nodefn.lift(filenames.get),
            makeTargetDir = nodefn.lift(prepareTargetDir),

            prodLocation = production[location.device][String(location.id)],
            expireTime,
            now = new Date();

/*
        if (prodLocation !== undefined) {

            expireTime = prodLocation.expires;

            // TODO : handle first request after midnight if cache is still valid
            // Simple approach, doesn't handle timezones yet.
            // if (moment().hour() === 23) { ...

            if (now.getTime() < expireTime) {

                console.log('USING PRODUCTION at ' + now + ' ' + location.id + ':' + location.name);
                cb(null, prodLocation.filenames);
                return;

            }

        }
*/

        getFilenamesFor(location)
            .then(makeTargetDir)
            .then(getWeather)
            .then(processWeather)
            .then(function (filenames) {
                console.log('USING NEW DATA at ' + now + ' ' + location.id + ':' + location.name + ':' + filenames[location.period]);
                var fname = filenames[location.period];
                location = null;
                cb(null, fname);
            });

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = weather;
    }

}());
