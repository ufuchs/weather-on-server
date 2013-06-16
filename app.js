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
//    fs = require('fs.extra'),
    weather = require('./weather.js'),
    app = express();

app.configure(function () {
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.get('/weather/:device/:id', function (req, res) {

    var id = 0,
        device = req.params.device,
        params;

    if (req.params.id !== 'undefined') {
        id = parseInt(req.params.id, 10);
    }

    if (req.params.device !== 'undefined') {
        device = req.params.device;
    }

    params = { id : id, device : device, lang : null };

    console.log(params);

    weather(params, function (filename, err) {
        console.log(filename);
        res.sendfile(filename);
    });

});

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log("Listening on " + port);
});
