/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs.extra'),
    path = require('path'),
    request = require('request'),

    localizer = require('./lib/localizer.js'),

    CFG = require('./app-config.js'),

    filenames = require('./lib/filenames.js'),

    cache = require('memory-cache'),

    I18n = require('i18n-2'),

    utils = require('./lib/utils.js'),

    provider = require('./lib/provider/index.js'),

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
// http://api.wunderground.com/api/496fa9023d2c0170/geolookup/conditions/forecast/q/Germany/Bad%20Elster.json nn
//
function downloadDataFromProvider(location, callback) {

    var params = {
            uri : provider.serviceUrl.populateWith(location),
            proxy : process.env.HTTP_PROXY
        };

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

    var cached;

    detectLocationById(id, function (location) {

//        cache.debug(true);

        cached = cache.get(id);

//        console.log(cache.hits());

        if (cached === null) {

            downloadDataFromProvider(location, function (err, jsonData) {

                if (err) {
                    console.log("Error while downloading weather data\n" + err);
                    throw err;
                }

                cache.put(id, jsonData, CFG.cachesProviderdataFor);

                callback(jsonData);

            });

        } else {
            callback(cached);
        }

    });

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
function core(params, jsonData, callback) {

    var l = localizer(new I18n(CFG.locales), CFG.iso3166ToLocale);

    provider.extractWeatherFromProviderData(jsonData, function (weather) {

        filenames(CFG).getFilenames(params, function (filenames) {

            l.localize(weather, params, function (localized) {

                populateSvgTemplate(weather, localized, filenames, function (svg) {

                    writeResults(svg, params, filenames, function (weatherPng, err) {

                        if (err !== null) {
                            console.log(err);
                        }

                        callback(path.resolve(weatherPng), err);

                    });

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

var params = { id : 1, device : 'kindle4nt', lang : 'cz' };

test(params, function (filename, err) {
    console.log('[Test Mode]\n' + '  WeatherFile = ' + filename);
});

///////////////////////////////////////////////////////////////////////////////