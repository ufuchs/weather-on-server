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
    locations = require('./locations.js'),
    utils = require('./lib/utils.js'),
    port = process.env.PORT || 5000;

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

    weather.main(location, function (err, filename) {

        console.log('response', filename);

        res.sendfile(filename);
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

    // Returns a _copy_ of the loction
    location = utils.getLocationById(locations.locations, id);

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

    id = parseInt(req.params.id, 10) || 0;

    forecastDay = parseInt(req.query.forecastDay, 10) || 0;

    if ((forecastDay > 3) || (forecastDay < 0)) {
        forecastDay = 0;
    }

    location = utils.getLocationById(locations, id);

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
