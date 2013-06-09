/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs.extra'),
    path = require('path'),
    request = require('request'),

    moment = require('moment'),

    localizer = require('./lib/localizer.js'),

    CFG = require('./app-config.js'),

    I18n = require('i18n-2'),
    i18n = new I18n(CFG.locales),

    utils = require('./lib/utils.js'),

    provider = require('./provider/wunderGround/index.js'),

    demoWeather = require('./test/2013-03-29.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

//
//
//
function populateSvgTemplate(params, weather, localized, callback) {

    var device = params.device,
        svgTemplateFilename = CFG.svgPool.dir
            + '/'
            + device
            + '/app-dir/'
            + CFG.svgPool.devices[device],
        tempUnit = localized.common.tempUnit;

    utils.readTextFile(svgTemplateFilename,  function (svgTemplate) {

        callback(utils.fillTemplates(svgTemplate, {

            // common 
            css : localized.cssFile,
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
// http://api.wunderground.com/api/496fa9023d2c0170/geolookup/conditions/forecast/q/Germany/Bad%20Elster.json nn
//
function downloadDataFromProvider(params, callback) {

    request(params, function (err, res, body) {

        if (err) {
            callback(err, null);
        }

        try {
            var jsonData = JSON.parse(body);
            callback(null, jsonData);
        } catch (jsonError) {
            callback(jsonError, null);
        }

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
            callback(loc);
            break;
        }

    }

}

//
// ! ANSEHEN !
//
function getWeatherByLocationId(id, callback) {

    var params;

    detectLocationById(id, function (loc) {

        params = {
            uri : provider.serviceUrl.populateWith(loc),
            proxy : process.env.HTTP_PROXY
        };

        downloadDataFromProvider(params, function (err, jsonData) {

            if (err) {
                console.log("Error while downloading weather data\n" + params);
                throw err;
            }

            callback(jsonData);

        });

    });

}

//
//
//
function getWeatherFilenames(params, callback) {

    var fn = CFG.weatherPool.fileNames,
        dir = CFG.weatherPool.dir + '/' + params.device + '/' + params.id + '/';

    callback({
        weatherSvg   : path.resolve(dir + fn.weatherSvg),
        unweatherPng : path.resolve(dir + fn.unweatherPng),
        weatherPng   : path.resolve(dir + fn.weatherPng)
    });

}

//
// 
//
function writeResults(svg, params, callback) {

    // 1
    getWeatherFilenames(params, function (out) {

        // 2
        fs.writeFile(out.weatherSvg, svg, function (err) {

            if (err) {
                callback(null, err);
                return;
            }

            // 3
            renderService.render(params.device, out, function (weatherPng, err) {
                callback(out.weatherPng, err);
            });

        });

    });

}

//
// 
//
function core(params, jsonData, callback) {

    var isoLocale = 'ru',
        l = localizer(i18n, CFG.iso3166ToLocale);

    provider.extractWeatherFromProviderData(jsonData, function (weather) {

        l.localize(weather, isoLocale, params.device, function (localized) {

            populateSvgTemplate(params, weather, localized, function (svg) {

                writeResults(svg, params, function (weatherPng, err) {

                    if (err !== null) {
                        console.log(err);
                    }

                    callback(path.resolve(weatherPng), err);

                });

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

    prepare(params, function () {

        getWeatherByLocationId(params.id, function (jsonData) {

            core(params, jsonData, callback);

        });

    });

};

module.exports = main;

///////////////////////////////////////////////////////////////////////////////

// THIS IS FOR TESTS ONLY.
// PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER
var test = function (params, callback) {

    prepare(params, function () {

        core(params, demoWeather, callback);

    });

};

var params = { id : 1, device : 'kindle4nt', lang : null };

test(params, function (filename, err) {
    console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
});

///////////////////////////////////////////////////////////////////////////////