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
        apikey = process.env.WUNDERGROUND_KEY,
        cachettl = cfg.cachesProviderdataFor;

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    weather(proxy, apikey, cachettl);
});

//
//
//
app.get('/weather/:device/:id', function (req, res) {

    var id = 0,
        device = req.params.device,
        location,
        params;

    if (req.params.id !== 'undefined') {
        id = parseInt(req.params.id, 10);
    }

    if (req.params.device !== 'undefined') {
        device = req.params.device;
    }

    location = detectLocationById(id);
    location.device = device;

    weather.main(location, function (err, filename) {
        console.log(filename);
        res.sendfile(filename);
    });

});

//
//
//
app.listen(port, function () {
    console.log("Listening on " + port);
});
