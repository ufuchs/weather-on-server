/*jslint node: true */
/*jslint todo: true */

'use strict';

var cfg = require('../weather-config.js'),
    fs = require('fs.extra'),
    wunderground = require('../lib/provider/wunderground.js'),
    proxy = process.env.HTTP_PROXY || process.env.http_proxy,
    apikey = process.env.WUNDERGROUND_KEY,

    location = {
        id: 1,
        lon: ["13.4542", "13° 27"],
        lat: ["52.5158", "52° 31'"],
        name: "Germany/Berlin",
        lang: "ru",
        device: "kindle4nt",
        period: 0

    },

    params = {
        location : {
            id: 1,
            lon: ["13.4542", "13° 27"],
            lat: ["52.5158", "52° 31'"],
            name: "Germany/Berlin",
            lang: "ru",
            device: "kindle4nt",
            period: 0

        },
        weather : {},
        json : null
    };


wunderground(proxy, apikey, 3600);

describe("wunderground", function () {

    var ready;

    it("valid reference of 'params'", function() {
        expect(params).not.toBe(null);
    });

    it("valid reference of 'wunderground'", function() {
        expect(wunderground).not.toBe(null);
    });

    it("valid reference of 'wunderground.weather'", function() {
        expect(wunderground.weather).not.toBe(null);
    });

    it("wunderground.getWeather", function () {

        runs(function () {
            ready = false;
            wunderground.useTestData(true);
            wunderground.getWeather(params, function (err, p) {
                ready = true;
            });
        });

        waitsFor(function() {
            return ready;
        }, "'getWeather' timed out", 10000);

        runs(function() {
            console.log(params.weather);

            // http://www.jsoneditoronline.org/
            fs.writeFile('spec/unweather.json', JSON.stringify(params.weather), function (err) {
                return;
            });

            expect(ready).toEqual(true);

        });

    });

    console.log("HIER");


});
