/*jslint node: true */
/*jslint todo: true */

'use strict';

var localizer = require('../lib/localizer.js'),
    location = require('./spec-config.js').location,
    params = require('./spec-config.js').params,
    locales = require('../locales/locales.js').locales,
    utils = require('../lib/utils.js');


describe("localizer", function () {

    var ready,
        weather;


    it("loadWeather", function () {

        runs(function () {
            ready = false;
            utils.readTextFile('spec/unweather.json', function (data) {
                weather = JSON.parse(data);
                ready = true;
            });

        });

        waitsFor(function() {
            return ready;
        }, "'loadWeather' timed out", 2000);

        runs(function() {
            console.log(weather);
            expect(ready).toEqual(true);
        });

    });



    it("locales", function () {

        var i18n = locales.i18n,
            iso3166ToLocale = locales.iso3166ToLocale,
            lang;


        expect(i18n).not.toBe(undefined);
        expect(iso3166ToLocale).not.toBe('undefined');

        console.log(i18n);
        console.log(iso3166ToLocale);

        lang = locales.mapIsoToI18n('cz');
        expect(lang).toBe('cs');

        lang = locales.mapIsoToI18n('dk');
        expect(lang).toEqual('da');

        lang = locales.mapIsoToI18n('de');
        expect(lang).toEqual('de');

    });



});
