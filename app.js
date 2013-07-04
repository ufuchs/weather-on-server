/*jslint node:true*/
'use strict';

/*!
 * index
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
function validateLocation(location) {

    if (location.device !== 'df3120') {
        location.period = 0;
    }

    if ((location.period > 3) || (location.period < 0)) {
        location.period = 0;
    }

    return location;

}

//
//
//
app.get('/weather/:device/:id', function (req, res) {

    var id = 0,
        device = req.params.device,
        location,
        period = 0;

    if (req.params.id !== undefined) {
        try {
            id = parseInt(req.params.id, 10);
        } catch (e1) {
            id = 1;
        }
    }

    if (req.params.device !== undefined) {
        device = req.params.device.toLowerCase();
    }

    if (req.query.period !== undefined) {
        try {
            period = parseInt(req.query.period, 10);
        } catch (e2) {
            period = 0;
        }
    }

    location = detectLocationById(id);
    location.device = device;
    location.period = period;

    location = validateLocation(location);

    console.log(location);

    weather.main(location, function (err, filenames) {
        console.log(filenames);
        res.sendfile(filenames[period]);
    });

});

//
//
//
app.listen(port, function () {
    console.log("Listening on " + port);
});
