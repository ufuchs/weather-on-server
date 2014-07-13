/*jslint node:true*/
'use strict';

/*!
 * server
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Our greatest weakness lies in giving up. The most certain way to ]
 * [ succeed is always to try just one more time.                     ]
 * [                                             - Thomas A. Edison - ]
 */

var express = require('express'),
    url = require('url'),
    weather = require('./lib/weather.js'),
    cfg = require('./weather-config.js'),
    locations = require('./locations.js'),
    utils = require('./lib/utils.js'),
    path = require('path'),
    app = express();

//
//
//
app.configure(function () {

    var proxy = process.env.HTTP_PROXY || process.env.http_proxy;

    app.set('port', process.env.PORT || 5000);

    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/public')));

    app.use(express.logger('dev'));

    weather.prepare(proxy);

});

//
//
//
app.configure('development', function () {
    app.use(express.errorHandler());
});

//
//
//
function getWeather(req, res) {

    console.log('request', req.id + ':' + req.device + ':' + req.name);

    weather.process(req, function (err, filename) {

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
        request,
        forecastDay = 0;

//    console.log(req._parsedUrl);

    // http://jsperf.com/performance-of-parseint/32
    // id = parseInt(req.params.id, 10) || 0;
    id = +req.params.id || 0;

    // Returns a _copy_ of the loction
    request = locations.getLocationById(id);

    request.device = device;
    request.period = forecastDay;

    getWeather(request, res);

});

//
//
//
app.get('/weather/df3120/:id', function (req, res) {

    var id,
        device = 'df3120',
        request,
        forecastDay;

    // regexp: /^\/weather\/df3120\/(?:([^\/]+?))\/?$/i
    // console.log(req);

    id = +req.params.id || 0;

    forecastDay = +req.query.forecastDay || 0;

    if ((forecastDay > 3) || (forecastDay < 0)) {
        forecastDay = 0;
    }

    request = locations.getLocationById(id);

    request.device = device;
    request.period = forecastDay;

    getWeather(request, res);

});

//
//
//
app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
