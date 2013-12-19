/*jslint node: true */
/*jslint todo: true */

'use strict';

var nodefn = require("when/node/function"),
    when = require('when'),
    downloader = require('../lib/downloader.js'),
    wundergroundQuery = require('../lib/provider/wunderground/query.js'),
    wundergroundExtractor = require('../lib/provider/wunderground/extractor.js'),
    demoWeather = require('../lib/provider/wunderground/2013-03-29.json'),
    utils = require('../lib/utils.js'),
    providerService =  require('../lib/providerService.js'),
    testCfg = require('./spec-config.js'),

    apikey = process.env.WUNDERGROUND_KEY,
    proxy = process.env.HTTP_PROXY || process.env.http_proxy,
    useTestData = true;

describe("apiKey", function () {

    it("'apiKey' shouldn't be 'undefined' or 'null'", function () {
        expect(apikey).toBeDefined();
        expect(apikey).not.toBe(null);
    });

    it("'apiKey' shouldn't be empty", function () {
        expect(apikey.length).not.toBe(0);
    });


});

/*
describe("wundergroundQuery", function () {

    var apiUri;

    it("shouldn't be null", function () {
        expect(wundergroundQuery).not.toBe(null);
    });

    wundergroundQuery(apikey);

    it("'getApiUri' should work", function () {

        apiUri = wundergroundQuery.getApiUri('de', 'Germany/Berlin');

        expect(apiUri).not.toBe(null);
        expect(apiUri.length).not.toBe(0);

    });

    it("should be 'DL' for 'de'", function () {
        expect(apiUri.indexOf(":DL")).toBe(83);
    });

});
*/

/*
describe("downloader", function () {

    var ready,
        jsonData;

    downloader(wundergroundQuery, apikey, proxy);

    runs(function () {
        ready = false;
        downloader.useTestData(useTestData);
        when(downloader.download('de', 'Germany/Berlin'))
            .then(function (json) {
                ready = true;
                jsonData = json;
            });

    });

    waitsFor(function() {
        return ready;
    }, "'download' timed out", 10000);

    runs(function() {

        console.log(jsonData);

        expect(ready).toEqual(true);

    });


});
*/

describe("providerService", function () {


    var wfo = testCfg.createWfo(),
        cfg = {
            downloader : downloader,
            query : wundergroundQuery,
            extractor : wundergroundExtractor,
        };

    providerService(cfg, apikey, proxy);

    providerService.process(wfo);

    console.log(wfo.json);

});

