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
    renderService = require('./lib/svg2png-renderer.js'),

    demoWeather = require('./test/2013-03-29.json');

(function (undefined) {

    var weather,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        reqLocation,

        reqFilenames;

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

                console.log(localized);

                deferred.resolve(utils.fillTemplates(svgTemplate, {

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

                }));

            });

        return deferred.promise;

    }

    //
    //
    //
    function writeResults(svg, cb) {

        fs.writeFile(reqFilenames.out.weatherSvg, svg, function (err) {

            if (err) {
                cb(null, err);
                return;
            }

            renderService.render({device : reqLocation.device, out : reqFilenames.out}, function (err, outPng) {
                cb(err, outPng);
            });

        });

    }

    //
    //
    //
    function prepareTargetDir(fileNames, cb) {

        var targetDir = fileNames.out.targetDir;

        fs.exists(targetDir, function (exists) {
            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, fileNames);
                    }
                });
            } else {
                cb(null, fileNames);
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
    function processWeatherdata(params, cb) {

        var writeRes = nodefn.lift(writeResults);

        populateSvgTemplate(params)
            .then(writeRes)
            .then(function (filename, err) {
                cb(err, filename);
            });
    }

    ///////////////////////////////////////////////////////////////////////////

    //
    //
    //
    weather.main = function (location, cb) {

        var writeRes = nodefn.lift(writeResults),
            getWeather = nodefn.lift(wunderground.getWeather),
            processWeather = nodefn.lift(processWeatherdata),

            getFilenamesFor = nodefn.lift(filenames.get),
            makeTargetDir = nodefn.lift(prepareTargetDir);

        getFilenamesFor(location)
            .then(makeTargetDir)
            .then(function (filenames) {
                reqFilenames = filenames;
                reqLocation = location;
                return {location : location, filenames : filenames};
            })
            .then(getWeather)
//            .then(populateSvgTemplate)
//            .then(writeRes)
            .then(processWeather)
            .then(function (l) {
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
