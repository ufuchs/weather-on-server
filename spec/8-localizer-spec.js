/*jslint node: true */
/*jslint todo: true */

'use strict';

var localizer = require('../lib/localizer.js'),
    request = require('./spec-config.js').request,
    locales = require('../locales/locales.js').locales,
    utils = require('../lib/utils.js');


utils.moment_applyPatch_de();

describe("localizer", function () {

    var ready,
        wfo = utils.createWfo(request),
        lang = 'ru';

    it("loadWeather", function () {

        runs(function () {
            ready = false;
            utils.readTextFile('spec/unweather.json', function (data) {
                wfo.weather = JSON.parse(data);
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

    it("localizer.init", function () {
        localizer.init(locales);
    });

    it("localizer.prepare", function () {
        localizer.prepare(wfo, lang);
    });

    it("localizer.dayZero", function () {
        var dayNum = 0;
        localizer.dayZero(
            {weather : wfo.weather, localized : wfo.localized},
            dayNum
        );
    });

    it("localizer.footer", function () {

        localizer.footer(
            {weather : wfo.weather, localized : wfo.localized}
        );
        console.log(JSON.stringify(wfo.localized, null, 2));
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
