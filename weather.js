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

        sun;

    //
    //
    //
    function makeTargetDir(params, callback) {

        var weatherPool = cfg.weatherPool.dir,
            targetDir = weatherPool + '/' + params.device + '/' + params.id;

        fs.exists(targetDir, function (exists) {

            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    callback(err);
                });
            } else {
                callback(null);
            }

        });

    }

    //
    //
    //
    function populateSvgTemplate(weather, params, filenames, callback) {

        var svgTemplate = filenames['in'].svgTemplate,
            tempUnit,
            localSun = params.id === 1 ? sun : null;

        makeTargetDir(params, function (err) {

            localizer.localize(weather, params, localSun, function (localized) {

                tempUnit = localized.common.tempUnit;

                utils.readTextFile(svgTemplate,  function (svgTemplate) {

                    callback(utils.fillTemplates(svgTemplate, {

                        // common
                        css : filenames['in'].cssFile,
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
        });
    }

    //
    //
    //
    function writeResults(svg, params, filenames, callback) {

        fs.writeFile(filenames.out.weatherSvg, svg, function (err) {

            if (err) {
                callback(null, err);
                return;
            }

            renderService.render(params.device, filenames.out, function (outPng, err) {
                callback(outPng, err);
            });

        });

    }


    //
    //
    //
    function core(params, weather, callback) {

        filenames.get(params, function (filenames) {

            populateSvgTemplate(weather, params, filenames, function (svg) {

                writeResults(svg, params, filenames, function (weatherPng, err) {

                    if (err !== null) {
                        console.log(err);
                    }

                    callback(path.resolve(weatherPng), err);

                });

            });

        });

    }

    //
    //
    //
    function detectLocationById(id, callback) {

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
    function prepare(cb) {

        var sunFileName = path.resolve(astro.getSunFilename(1));

        utils.readTextToArray(sunFileName, function (err, lines) {
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

        prepare(function (err, lines) {

            if (err) {
                throw err;
            }

            sun = lines;

            wunderground(proxy, apikey, cachettl);
            localizer(cfg);
            filenames(cfg);

        });


    };

    ///////////////////////////////////////////////////////////////////////////

    //
    //
    //
    weather.main = function (params, callback) {

        var location = detectLocationById(params.id);

        params.lang = location.language;

        wunderground.getWeather(location, function (weather) {

            core(params, weather, callback);

        });

    };

///////////////////////////////////////////////////////////////////////////////

    // THIS IS FOR TESTS ONLY.
    // PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

    weather.test = function (callback) {

        var params = { id : 1, device : 'kindle4nt', lang : 'de' };

        wunderground.extractWeather(demoWeather, function (weather) {

            core(params, weather, callback);

        });

    };


    (function test() {

        prepare(function (err, lines) {

            if (err) {
                throw err;
            }

            sun = lines;

            localizer(cfg);
            filenames(cfg);

            weather.test(function (filename, err) {
                console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
            });

        });


    })();
///////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = weather;
    }

}).call(this);
