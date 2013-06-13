/*jslint node: true */
/*jslint todo: true */

'use strict';

var wundergroundAstro = require('./lib/provider/wundergroundAstro.js'),
    wundergroundReq = require('./lib/provider/wundergroundReq.js'),
    demoWeather = require('./test/2013-03-29.json'),
    wgA = wundergroundAstro(),
    wgR = wundergroundReq(process.env.HTTP_PROXY, process.env.WONDERGROUND_KEY, 0),
    location = {
        "id": 1,
        "name": "Germany/Berlin",
        "language": "de"
    };


wgA.update(demoWeather);
console.log(wgA.sun());

/*
wgR.get(location, function (data) {
    console.log('X');
});
*/



