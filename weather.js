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



(function (undefined) {

    var weather,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);

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
                cb(null, err);
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
                    } else {
                        cb(null, params);
                    }
                });
            } else {
                cb(null, params);
            }
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
                console.log('calling');
                cb(err, filename);
            });

    }

    //
    //
    //
    function adjustFileNames(params, period) {

        var weatherSvg = params.filenames.out.weatherSvg.split('.'),
            unweatherPng = params.filenames.out.unweatherPng.split('.'),
            weatherPng = params.filenames.out.weatherPng.split('.');


//        file.substr(0, file.indexOf('-'))

        weatherSvg = weatherSvg[0].substr(0, weatherSvg[0].indexOf('-')) + '-' + period + '.' + weatherSvg[1];
        unweatherPng = unweatherPng[0] + '-' + period + '.' + unweatherPng[1];
        weatherPng = weatherPng[0] + '-' + period + '.' + weatherPng[1];

        params.filenames.out.weatherSvg = weatherSvg;
        params.filenames.out.unweatherPng = unweatherPng;
        params.filenames.out.weatherPng = weatherPng;

        return params;

    }

    //
    //
    //
    function processWeatherdata(params, cb) {

        var period = 0,
            maxFiles = cfg.weatherfiles.quantity[params.location.device],
            files = [],
            orgParams = params;

        function process(period) {

            if (period < maxFiles) {

                adjustFileNames(orgParams, period);

                processWeather4Device(params, function (err, filename) {

                    if (err) {
                        cb(err, null);
                    } else {
                        files.push(filename);
                        process(period + 1);
                    }

                });

            } else {
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
            makeTargetDir = nodefn.lift(prepareTargetDir);

        getFilenamesFor(location)
            .then(makeTargetDir)
            .then(getWeather)
            .then(processWeather)
            .then(function (l) {
                console.log(l);
                cb(null, l);
            });

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = weather;
    }

}).call(this);
