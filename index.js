/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * index
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

var fs = require('fs.extra'),
    path = require('path'),
    request = require('request'),

    wunderground = require('./lib/provider/wunderground.js'),

    wg = wunderground(process.env.HTTP_PROXY, process.env.WONDERGROUND_KEY, 0),

    CFG = require('./app-config.js'),

    localizer = require('./lib/localizer.js'),

    l = localizer(CFG),

    filenames = require('./lib/filenames.js'),

    utils = require('./lib/utils.js'),

    demoWeather = require('./test/2013-03-29.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

//
//
//
function populateSvgTemplate(weather, localized, filenames, callback) {

    var svgTemplate = filenames['in'].svgTemplate,
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
            dl : localized.sun.dayLenght,

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
function writeResults(svg, params, filenames, callback) {

    // 1
    fs.writeFile(filenames.out.weatherSvg, svg, function (err) {

        if (err) {
            callback(null, err);
            return;
        }

        // 2
        renderService.render(params.device, filenames.out, function (outPng, err) {
            callback(outPng, err);
        });

    });

}

//
// 
//
function core(params, weather, callback) {

    var localized = l.localize(weather, params);

    console.log(weather);

    filenames(CFG).getFilenames(params, function (filenames) {

        populateSvgTemplate(weather, localized, filenames, function (svg) {

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
function makeTargetDir(params, callback) {

    var svgPool = CFG.svgPool.dir,
        weatherPool = CFG.weatherPool.dir,
        targetDir = weatherPool + '/' + params.device + '/' + params.id;

    fs.exists(targetDir, function (exists) {

        if (!exists) {
            fs.mkdir(targetDir, function (err) {
                callback(err);
            });
        }

        callback(null);

    });

}

//
//
//
function prepare(params, callback) {

    var svgPool = CFG.svgPool.dir,
        weatherPool = CFG.weatherPool.dir;

    fs.exists(weatherPool, function (exists) {

        if (!exists) {

            fs.copyRecursive(svgPool, weatherPool, function (err) {

                if (err) {
                    callback(err);
                }

                fs.rmrf(weatherPool + '/df3120/app-dir', function (err) {

                    if (err) {
                        callback(err);
                    }

                    fs.rmrf(weatherPool + '/kindle4nt/app-dir', function (err) {

                        if (err) {
                            callback(err);
                        }

                        makeTargetDir(params, function (err) {
                            callback(err);
                        });

                    });

                });

            });

        } else {

            makeTargetDir(params, function (err) {
                callback(err);
            });

        }

    });

}

//
// 
//
var main = function (params, callback) {

    var location = detectLocationById(params.id);

    prepare(params, function () {

        wunderground.getWeather(location, function (weather) {

            core(params, weather, callback);

        });

    });

};

module.exports = main;

///////////////////////////////////////////////////////////////////////////////

// THIS IS FOR TESTS ONLY.
// PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER
/*
var test = function (params, callback) {

    prepare(params, function () {

        core(params, demoWeather, callback);

    });

};

var params = { id : 1, device : 'df3120', lang : 'ru' };

test(params, function (filename, err) {
    console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
});
*/
///////////////////////////////////////////////////////////////////////////////