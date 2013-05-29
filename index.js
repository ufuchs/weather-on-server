/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    astro = require('./astronomy/utils.js'),

    mkdirp = require('mkdirp'),



    CFG = require('./app-config.js'),
    locale = require('./i18n/de_DE.json'),
    utils = require('./lib/utils.js'),

    provider = require('./provider/wunderGround/index.js'),

    demoWeather = require('./test/2013-03-29.json'),



    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

function Weather(provider) {

    this.provider = provider;
    this.config = CFG;

}

//
//
//
function populateSvgTemplate(device, weather, callback) {

    var svgTemplateFilename = CFG.svgPool.dir + '/' + CFG.svgPool.devices[device];

    console.log(path.resolve(CFG.svgPool.dir));

    utils.readTextFile(svgTemplateFilename,  function (svgTemplate) {

        callback(utils.fillTemplates(svgTemplate, {

            date : weather.date,
            doy : weather.doy,

            tempUnit : '°C',

            sr : 'SA' + ' ' + astro.formatSec2HhMm(weather.sr),
            ss : 'SU' + ' ' + astro.formatSec2HhMm(weather.ss),
            dl : astro.formatSec2HhMm(weather.dl, ':') + 'h',
            dld : '', //weather.dld,
            icoPath : path.resolve(CFG.svgPool.dir),

            // today
            dow0 : locale.dayOfWeek.today,
            h0 : weather.h0,
            l0 : weather.l0,
            ic0 : weather.ic0,
            sic0 : weather.sic0,

            // tommorow
            dow1 : locale.dayOfWeek.tomorrow,
            h1 : weather.h1,
            l1 : weather.l0,
            ic1 : weather.ic1,
            sic1 : weather.sic1,

            // day after tommorow
            dow2 : weather.dow2,
            h2 : weather.h2,
            l2 : weather.l2,
            ic2 : weather.ic2,
            sic2 : weather.sic2,

            // // day after tommorow + 1
            dow3 : weather.dow3,
            h3 : weather.h3,
            l3 : weather.l3,
            ic3 : weather.ic3,
            sic3 : weather.sic3,

            update : weather.lastObservation

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
        dir = CFG.weatherPool.dir + '/' + params.id + '/' + params.device + '/';

    mkdirp(dir, 509, function (err) {

        if (err !== null) {
            throw err;
        }

        callback({
            weatherSvg   : path.resolve(dir + fn.weatherSvg),
            unweatherPng : path.resolve(dir + fn.unweatherPng),
            weatherPng   : path.resolve(dir + fn.weatherPng)
        });

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

    provider.extractWeatherFromProviderData(jsonData, function (weather) {

        populateSvgTemplate(params.device, weather, function (svg) {

            writeResults(svg, params, function (weatherPng, err) {

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
var main = function (params, callback) {

    getWeatherByLocationId(params.id, function (jsonData) {

        core(params, jsonData, callback);

    });

};

module.exports = main;



// THIS IS FOR TESTS ONLY.
// PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

var test = function (params, callback) {

    core(params, demoWeather, callback);

};

var params = { id : 1, device : 'kindle4nt' };

test(params, function (filename, err) {
    console.log('test mode: ' + filename);
});

