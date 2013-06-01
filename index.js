/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    astro = require('./astronomy/utils.js'),

    moment = require('moment'),

    mkdirp = require('mkdirp'),

    I18n = require('i18n-2'),
    i18n = new I18n({locales: ['en', 'de']}),


    CFG = require('./app-config.js'),
//    locale = require('./i18n/de_DE.json'),
    utils = require('./lib/utils.js'),

    provider = require('./provider/wunderGround/index.js'),

    demoWeather = require('./test/2013-03-29.json'),

    locale = require('./i18n/de_DE.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

function Weather(provider) {

    this.provider = provider;
    this.config = CFG;

}

//
// 
//
function getLocalDate(epoch) {
    var d = new Date(epoch);

    return utils.fillTemplates(locale.timeFormat.currDate, {
        day: d.getDate(),
        month: locale.months[d.getMonth()].abbr
    });

}

//
// TODO : umbauen auf 'observation_time_rfc822'
//
function getObservationTimeFormated(epoch) {

    /*
    "observation_time":"Last Updated on Januar 31, 22:13 CET",
    "observation_time_rfc822":"Thu, 31 Jan 2013 22:13:09 +0100",
    "observation_epoch":"1359666789",
    "local_time_rfc822":"Thu, 31 Jan 2013 22:22:07 +0100",
    "local_epoch":"1359667327",
    "local_tz_short":"CET",
    "local_tz_long":"Europe/Berlin",
    "local_tz_offset":"+0100",
    */

    var d = new Date(epoch),
        ts = d.toTimeString().split(' '),
        time = ts[0].split(':');
    return utils.fillTemplates(locale.timeFormat.observationTime, {
        day: d.getDate(),
        month: locale.months[d.getMonth()].abbr,
        hour: time[0],
        min: time[1],
        timezone: ts[1]
    });

}


//
//
//
function populateSvgTemplate(device, weather, callback) {

    var svgTemplateFilename = CFG.svgPool.dir + '/' + CFG.svgPool.devices[device],
        cssFile,
        today,
        doy,
        hhmm,
        sr,
        ss,
        dayLenght,
        dayLenghtDiff,
        tomorrow,
        min,
        max,
        update;

    i18n.setLocale('de');

    // function i18n()

    cssFile = device + '.css';

    today = i18n.__('today');

    tomorrow = i18n.__('tomorrow');

    doy = utils.fillTemplates(i18n.__('dayOfYear'), {
        doy: moment(weather.date).dayOfYear()
    });

    // TODO : !Zusammenfassen!
    hhmm = astro.sec2HhMm(weather.sr);
    sr = utils.fillTemplates(i18n.__('sunrise'), {
        hour : hhmm.hour,
        min : hhmm.min
    });

    hhmm = astro.sec2HhMm(weather.ss);
    ss = utils.fillTemplates(i18n.__('sunset'), {
        hour : hhmm.hour,
        min : hhmm.min
    });

    console.log(ss);

    hhmm = astro.sec2HhMm(weather.dl);
    dayLenght = utils.fillTemplates(i18n.__('dayLenght'), {
        hours : hhmm.hour,
        min : hhmm.min
    });

    dayLenghtDiff = '';

    min = i18n.__('minimal');

    max = i18n.__('maximal');

    update = getObservationTimeFormated(weather.lastObservation);

    // 

    utils.readTextFile(svgTemplateFilename,  function (svgTemplate) {

        callback(utils.fillTemplates(svgTemplate, {

            css : cssFile,

            date : getLocalDate(weather.date),
            doy : doy,

            // TODO : HERE!
            tempUnit : '°C',

            sr : sr,
            ss : ss,
            dl : dayLenght,
            dld : dayLenghtDiff,

            min : min,
            max : max,

            // today
            dow0 : today,
            h0 : weather.h0,
            l0 : weather.l0,
            ic0 : weather.ic0,
            sic0 : weather.sic0,

            // tommorow
            dow1 : tomorrow,
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

            update : update

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
            weatherCss   : path.resolve(dir + params.device + '.css'),
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

    var cssFile = CFG.svgPool.dir + '/' + params.device + '.css';
 
    // 1
    getWeatherFilenames(params, function (out) {

        // copy the style sheet into the weather dir
        fs.createReadStream(cssFile).pipe(fs.createWriteStream(out.weatherCss));

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

