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
    CFG = require('./app-config.js'),
    localizer = require('./lib/localizer.js'),

    filenames = require('./lib/filenames.js'),

    utils = require('./lib/utils.js'),

    demoWeather = require('./test/2013-03-29.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

//
//
//
function makeTargetDir(params, callback) {

    var weatherPool = CFG.weatherPool.dir,
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
function populateSvgTemplate(weather, params, filenames, callback) {

    var svgTemplate = filenames['in'].svgTemplate,
        tempUnit;

    makeTargetDir(params, function (err) {

        localizer.localize(weather, params, function (localized) {

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
var main = function (params, callback) {

    var location = detectLocationById(params.id);

    wunderground.getWeather(location, function (weather) {

        core(params, weather, callback);

    });

};

wunderground(process.env.HTTP_PROXY || process.env.http_proxy, process.env.WUNDERGROUND_KEY, CFG.cachesProviderdataFor);
localizer(CFG);
filenames(CFG);

module.exports = main;

///////////////////////////////////////////////////////////////////////////////

// THIS IS FOR TESTS ONLY.
// PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

var test = function (params, callback) {

    wunderground.extractWeather(demoWeather, function (weather) {

        core(params, weather, callback);

    });

};

var params = { id : 1, device : 'kindle4nt', lang : 'ru' };

test(params, function (filename, err) {
    console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
});

///////////////////////////////////////////////////////////////////////////////