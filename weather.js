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

    wunderground = require('./lib/provider/wunderground.js'),
    cfg = require('./weather-config.js'),
    localizer = require('./lib/localizer.js'),
    filenames = require('./lib/filenames.js'),
    utils = require('./lib/utils.js'),
    renderService = require('./lib/svg2png-renderer.js'),
    locations = require('./locations.json').locations,
    astro = require('./lib/astronomy/utils.js'),

    demoWeather = require('./test/2013-03-29.json');

(function (undefined) {

    var weather,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        reqParams,

        reqFilenames,

        sun;

    //
    //
    //
    function makeTargetDir(fileNames, callback) {

        var targetDir = fileNames.out.targetDir;

        fs.exists(targetDir, function (exists) {

            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, fileNames);
                    }
                });
            } else {
                callback(null, fileNames);
            }

        });

    }

    //
    //
    //
    function detectLocationById(id) {

        var i,
            loc;

        for (i = 0; i < locations.length; i += 1) {

            loc = locations[i];

            if (loc.id === id) {
                return loc;
            }

        }

        return null;

    }

    //
    //
    //
    function populateSvgTemplate(weather, callback) {

        var svgTemplate = reqFilenames['in'].svgTemplate,
            tempUnit;

        localizer.localize(weather, reqParams, sun, function (localized) {

            tempUnit = localized.common.tempUnit;

            utils.readTextFile(svgTemplate,  function (svgTemplate) {

                callback(utils.fillTemplates(svgTemplate, {

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

            });

        });
    }

    //
    //
    //
    function writeResults(svg, callback) {

        fs.writeFile(reqFilenames.out.weatherSvg, svg, function (err) {

            if (err) {
                callback(null, err);
                return;
            }

            renderService.render(reqParams.device, reqFilenames.out, function (err, outPng) {
                callback(err, outPng);
            });

        });

    }

    //
    //
    //
    function core(location, callback) {

        wunderground.getWeather(location, function (weather) {

            populateSvgTemplate(weather, function (svg) {

                writeResults(svg, function (err, weatherPng) {

                    if (err !== null) {
                        console.log(err);
                    }

                    callback(err, weatherPng);

                });

            });

        });

    }

    //
    //
    //
    function prepare(cb) {

        var sunFileName = path.resolve(astro.getSunFilename(1));

        utils.readTextToArray(astro.getSunFilename(1), function (err, lines) {
            cb(err, lines);
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

    ///////////////////////////////////////////////////////////////////////////

    //
    //
    //
    weather.main = function (params, callback) {

        var location;

        reqParams = params;

        location = detectLocationById(reqParams.id);

        reqParams.lang = location.language;

        filenames.get(reqParams, function (fileNames) {

            reqFilenames = fileNames;

            // former 'prepare'
            makeTargetDir(fileNames, function (err, fileNames) {

                utils.readTextToArray(fileNames['in'].sunFile, function (err, lines) {

                    if (!err) {
                        sun = lines;
                    } else {
                        sun = null;
                    }

                    core(location, callback);

                });

            });

        });

    };

///////////////////////////////////////////////////////////////////////////////

    // THIS IS FOR TESTS ONLY.
    // PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

    weather.test = function (callback) {

        reqParams = { id : 1, device : 'kindle4nt', lang : 'de' };

        wunderground.extractWeather(demoWeather, function (weather) {

            core(weather, callback);

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
