/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs.extra'),
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
function getLocalDate(i18n, epoch) {
    var d = new Date(epoch);

    return utils.fillTemplates(locale.timeFormat.currDate, {
        day: d.getDate(),
        month: locale.months[d.getMonth()].abbr
    });

}

//
// TODO : umbauen auf 'observation_time_rfc822'
//
function getObservationTimeFormated(i18n, epoch) {

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

function i18n_getHeader() {

    var today = i18n.__('today'),
        dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
            day: 'MM',
            month: 'MMM'
        }),
        date,
        doy;

    if ((today === '') || (today === null)) {
        today = moment().format('dddd');
    }

    date = moment().format(dateFormatStr);

    doy = utils.fillTemplates('{{doy}}-й день года', {
        doy: moment().dayOfYear()
    });

    return {
        today : today,
        date : date,
        doy : doy
    };

}

//
//
//
function populateSvgTemplate(params, weather, callback) {

    var device = params.device,
        svgTemplateFilename = CFG.svgPool.dir
            + '/'
            + device
            + '/app-dir/'
            + CFG.svgPool.devices[device],
        cssFilename = device + '.css',
        countryISO,
        tempUnit,
        tempUnitToDisplay,
        header = i18n_getHeader(),
        today,
        date,
        doy,
        hhmm,
        sr,
        ss,
        dayLenght,
        dayLenghtDiff,
        tomorrow,
        min,
        max,
        update,
        str;

    console.log(svgTemplateFilename);

    countryISO = weather.countryISO.toLowerCase();

    i18n.setLocale(countryISO);
    var iso = moment().lang(countryISO);

    // function i18n()

    ///////////////////////////////////////////////////////////////

    str = i18n.__('tempUnit').split('_');

    tempUnit = str[0];

    tempUnitToDisplay = str[1];

    ///////////////////////////////////////////////////////////////

    min = i18n.__('minimal');

    max = i18n.__('maximal');

    today = i18n.__('today');

    date = getLocalDate(i18n, weather.date);

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

    hhmm = astro.sec2HhMm(weather.dl);
    dayLenght = utils.fillTemplates(i18n.__('dayLenght'), {
        hours : hhmm.hour,
        min : hhmm.min
    });

    dayLenghtDiff = '';

    tomorrow = i18n.__('tomorrow');

    update = getObservationTimeFormated(i18n, weather.lastObservation);

    // 

    utils.readTextFile(svgTemplateFilename,  function (svgTemplate) {

        callback(utils.fillTemplates(svgTemplate, {

            // common 
            css : cssFilename,
            tempUnit : tempUnitToDisplay,
            min : min,
            max : max,

            // headline
            dow0 : today,
            date : date,
            doy : header.doy,

            // sun
            sr : sr,
            ss : ss,
            dl : dayLenght,

            h0 : weather.temp0.high[tempUnit],
            l0 : weather.temp0.low[tempUnit],
            ic0 : weather.ic0,

            // tommorow
            dow1 : tomorrow,
            h1 : weather.temp1.high[tempUnit],
            l1 : weather.temp1.low[tempUnit],
            ic1 : weather.ic1,

            // day after tommorow
            dow2 : weather.dow2,
            h2 : weather.temp2.high[tempUnit],
            l2 : weather.temp2.low[tempUnit],
            ic2 : weather.ic2,

            // // day after tommorow + 1
            dow3 : weather.dow3,
            h3 : weather.temp3.high[tempUnit],
            l3 : weather.temp3.low[tempUnit],
            ic3 : weather.ic3,

            // observation time line
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

    provider.extractWeatherFromProviderData(jsonData, function (weather) {

        populateSvgTemplate(params, weather, function (svg) {

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



// THIS IS FOR TESTS ONLY.
// PREVENTING PERMANENTLY DOWNLOADS FROM THE PROVIDER

var test = function (params, callback) {

    prepare(params, function () {

        core(params, demoWeather, callback);

    });

};

var params = { id : 1, device : 'kindle4nt', lang : null };

test(params, function (filename, err) {
    console.log('test mode: ' + filename);
});

