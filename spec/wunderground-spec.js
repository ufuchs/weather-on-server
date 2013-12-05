/*jslint node: true */
/*jslint todo: true */

'use strict';

var cfg = require('../weather-config.js'),
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

    var flag;

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
            flag = false;
            wunderground.useTestData(true);
            wunderground.getWeather(params, function (err, p) {
                flag = true;
            });
        });

        waitsFor(function() {
            return flag;
        }, "The Value should be incremented", 10000);

        runs(function() {
            expect(flag).toEqual(true);
        });

    });


});
