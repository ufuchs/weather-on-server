/*jslint node: true */
/*jslint todo: true */

'use strict';

var configurator = require('../lib/configurator.js'),
    weatherProcessor = require('../lib/weatherProcessor.js'),
    appcfg = require('../weather-config.js'),
    testCfg = require('./spec-config.js'),
    utils = require('../lib/utils.js'),
    path = require("path");

describe("weatherProcessor", function () {

    var location = {
            id: 1,
            name: "Germany/Berlin",
            lang: "ru",
            device: "kindle4nt",
            period: 0

        },
        wfo = testCfg.createWfo(location),
        kindle = path.resolve(__dirname, '../public/weather');

    it("needs extracted weather data", function () {

        var ready;

        runs(function () {
            ready = false;
            utils.readTextFile(path.join(kindle, 'unweather.json'), function (data) {
                wfo.weather = JSON.parse(data);
                ready = true;
            });
        });

        waitsFor(function() {
            return ready;
        }, "*readTextFile* timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });

    });

    it("needs a configuration", function () {

        var ready;

        configurator(appcfg);

        runs(function () {

            ready = false;

            configurator.configure(wfo)
                .then(function (result) {
                    ready = true;
//                    wfo = result;
                }, function (err) {
                    console.log(err);
                });

        });

        waitsFor(function() {
            return ready;
        }, "'configurator.configure' timed out", 500);

        runs(function() {
            expect(ready).toEqual(true);
//            console.log('wfo.cfg : ', wfo.cfg);
        });

    });

    weatherProcessor();

    it("shouldn't be null or undefined", function () {
        expect(weatherProcessor).toBeDefined();
        expect(weatherProcessor).not.toBe(null);
    });


    it("should work", function () {

        var ready;

        runs(function () {

            ready = false;

            weatherProcessor.process(wfo)
                .then(function (result) {
                    ready = true;
                }, function (err) {
                    console.log(err);
                });

        });

        waitsFor(function() {
            return ready;
        }, "*weatherProcessor.process* timed out", 5000);

        runs(function() {
            expect(ready).toEqual(true);
//            console.log('wfo.cfg : ', wfo.cfg);
        });

    });

});
