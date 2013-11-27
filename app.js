/*jslint node:true*/
'use strict';

/*!
 * app
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Our greatest weakness lies in giving up. The most certain way to ]
 * [ succeed is always to try just one more time.                     ]
 * [                                             - Thomas A. Edison - ]
 */

var express = require('express'),
    weather = require('./weather.js'),
    cfg = require('./weather-config.js'),
    app = express(),
    locations = require('./locations.json').locations,
    port = process.env.PORT || 5000;

//
//
//
function detectLocationById(id) {

    var i = 0,
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
app.configure(function () {

    var proxy = process.env.HTTP_PROXY || process.env.http_proxy,
        apikey = process.env.WUNDERGROUND_KEY;

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    weather(proxy, apikey);
});

//
//
//
function getWeather(location, res) {

    console.log('request', location.id + ':' + location.name);

    weather.main(location, function (err, filenames) {

        console.log('response', filenames[location.period]);

        res.sendfile(filenames[location.period]);
    });

}

//
//
//
app.get('/weather/version', function (req, res) {
    res.send('v0.1beta');
});

//
//
//
app.get('/weather/kindle4nt/:id', function (req, res) {

    var id,
        device = 'kindle4nt',
        location,
        forecastDay = 0;

    id = parseInt(req.params.id, 10) || 0;

    location = detectLocationById(id);

    location.device = device;
    location.period = forecastDay;

    getWeather(location, res);

});

//
//
//
app.get('/weather/df3120/:id', function (req, res) {

    var id,
        device = 'df3120',
        location,
        forecastDay;

    console.log('--------------------------------------');

    id = parseInt(req.params.id, 10) || 0;

    forecastDay = parseInt(req.query.forecastDay, 10) || 0;

    if ((forecastDay > 3) || (forecastDay < 0)) {
        forecastDay = 0;
    }

    location = detectLocationById(id);

    location.device = device;
    location.period = forecastDay;

    getWeather(location, res);

});

//
//
//
app.listen(port, function () {
    console.log("Listening on " + port);
});
