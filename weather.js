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
    function populateSvgTemplate(weather) {

        var tempUnit,
            svgTemplate,
            localize = nodefn.lift(localizer.localize),
            deferred = when.defer();

        console.log(reqFilenames);

        callbacks.call(utils.readTextFile, reqFilenames['in'].svgTemplate)
            .then(function (template) {
                svgTemplate = template;
                return {updatedWeather : weather, location : reqLocation};
            })
            .then(localize)
            .then(function (localized) {

                tempUnit = localized.common.tempUnit;

                deferred.resolve(utils.fillTemplates(svgTemplate, {

                    // common
                    css : reqFilenames['in'].cssFile,
                    tempUnit : localized.common.tempUnitToDisplay,
                    min : localized.common.min,
                    max : localized.common.max,

                    // headline
                    dow0 : localized.header.today,
                    date : localized.header.date,
                    doy : localized.header.doy,

                    // sun
                    sr : localized.sun.sr,
                    ss : localized.sun.ss,
                    dl : localized.sun.dl + '   ' + localized.sun.dld,


                    h0 : weather.temp0.high[tempUnit],
                    l0 : weather.temp0.low[tempUnit],
                    ic0 : weather.ic0,

                    // tommorow
                    dow1 : localized.weekdays.tomorrow,
                    h1 : weather.temp1.high[tempUnit],
                    l1 : weather.temp1.low[tempUnit],
                    ic1 : weather.ic1,

                    // day after tommorow
                    dow2 : localized.weekdays.day_after_tomorrow,
                    h2 : weather.temp2.high[tempUnit],
                    l2 : weather.temp2.low[tempUnit],
                    ic2 : weather.ic2,

                    // // day after tommorow + 1
                    dow3 : localized.weekdays.day_after_tomorrow_plusOne,
                    h3 : weather.temp3.high[tempUnit],
                    l3 : weather.temp3.low[tempUnit],
                    ic3 : weather.ic3,

                    // footer
                    update : localized.footer

                }));


            }, function (err) {
                deferred.reject(new Error(err));
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

            var params = {
                device : reqLocation.device,
                out : reqFilenames.out
            };

            renderService.render(params, function (err, outPng) {
                cb(err, outPng);
            });

        });

    }

    //
    //
    //
    function core(location) {

        var writeRes = nodefn.lift(writeResults),
            deferred = when.defer();

        callbacks.call(wunderground.getWeather, location)
            .then(populateSvgTemplate)
            .then(writeRes)
            .then(function (weatherPng) {
                deferred.resolve(weatherPng);
            }, function (err) {
                deferred.reject(new Error(err));
            });

        return deferred.promise;

    }

    //
    //
    //
    function makeTargetDir(fileNames) {

        var targetDir = fileNames.out.targetDir,
            deferred = when.defer();

        fs.exists(targetDir, function (exists) {
            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        deferred.reject(new Error(err));
                    } else {
                        deferred.resolve(fileNames);
                    }
                });
            } else {
                deferred.resolve(fileNames);
            }
        });
        return deferred.promise;

    }

    //
    //
    //
    function getFilenames(location) {

        var deferred = when.defer();

        filenames.get(location, function (fileNames) {

            if (fileNames === null) {
                deferred.reject(new Error('missing filenames'));
            } else {
                deferred.resolve(fileNames);
            }

        });

        return deferred.promise;

    }

    //
    //
    //
    function prepare(location) {

        var deferred = when.defer();

        getFilenames(location)
            .then(makeTargetDir)
            .then(function (fileNames) {
                reqFilenames = fileNames;
                reqLocation = location;
                deferred.resolve(reqLocation);
            }, function (err) {
                deferred.reject(new Error(err));
            });

        return deferred.promise;

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

    ///////////////////////////////////////////////////////////////////////////

    //
    //
    //
    weather.main = function (location, cb) {

        prepare(location)
            .then(core)
            .then(function (l) {
                cb(null, l);
            });

    };

///////////////////////////////////////////////////////////////////////////////

    // THIS IS FOR TESTS ONLY.
    // PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

    weather.test = function (callback) {

        reqParams = { id : 1, device : 'kindle4nt', lang : 'de' };

        wunderground.extractWeather(demoWeather, function (weather) {

//            core(weather, callback);

        });

    };


    /*
    (function test() {

        prepare(function (err, lines) {

            if (err) {
                throw err;
            }

            sun = lines;

            localizer(cfg);
            filenames(cfg);

            weather.test(function (err, filename) {
                console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
            });

        });


    }());
    */

///////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = weather;
    }

}).call(this);
