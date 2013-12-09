/*jslint node: true */
/*jslint todo: true */

'use strict';

var localizer = require('../lib/localizer.js'),
    location = require('./spec-config.js').location,
    params = require('./spec-config.js').params,
    locales = require('../locales/locales.js').loc,
    utils = require('../lib/utils.js');



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

        var x = null;


        localizer();

        runs(function() {
            ready = false;
            x = null;
            x = localizer.localize(params);
                        console.log(x);
            ready = x !== null;
        });

        waitsFor(function() {
            return ready;
        }, "'localize' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });



    });


/*
    it("locales", function () {


        var l = locales.moment,
            i = locales.iso3166ToLocale,
            x = locales.xy.moment;

        expect(l).not.toBe(null);
        expect(i).not.toBe(null);

        console.log(l);
        console.log(x);


    });
*/


});
