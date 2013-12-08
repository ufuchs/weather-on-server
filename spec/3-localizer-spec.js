/*jslint node: true */
/*jslint todo: true */

'use strict';

var localizer = require('../lib/localizer.js'),
    location = require('./spec-config.js').location,
    params = require('./spec-config.js').params,
    utils = require('../lib/utils.js');

localizer();

describe("localizer", function () {

    var ready;

    it("loadWeather", function () {

        runs(function () {
            ready = false;
            utils.readTextFile('spec/unweather.json', function (data) {
                params.weather = JSON.parse(data);
                ready = true;
            });

        });

        waitsFor(function() {
            return ready;
        }, "'loadWeather' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });

    });

    it("localizer.localize", function () {

        waitsFor(function() {
            return ready;
        }, "'localize' timed out", 2000);

        runs(function() {
            ready = false;
            localizer.localize(params, function(err, data) {
                ready = true;
//                console.log(data.localized);
            })


        });

        waitsFor(function() {
            return ready;
        }, "'localize' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });

    });

});
