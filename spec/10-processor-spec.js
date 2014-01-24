/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
    kindle4ntLocalizer = require('../lib/kindle4ntLocalizer.js'),
    request = require('./spec-config.js').request,
    locales = require('../locales/locales.js').locales,
    processor = require('../lib/processor.js'),
    appcfg = require('../weather-config.js'),
    configurator = require('../lib/configurator.js'),
    utils = require('../lib/utils.js');

utils.moment_applyPatch_de();

configurator(appcfg);

describe("processor", function () {

    var ready,
        wfo = utils.createWfo(request),
        localizer =


    it("configurator.configure", function () {

        runs(function () {
            ready = false;


        configurator.configure(wfo)
            .then(function (result) {
                ready = true;
                wfo = result;

            }, function (err) {
                console.log(err);
            })


        });

        waitsFor(function() {
            return ready;
        }, "'loadWeather' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
            console.log(JSON.stringify(wfo.cfg, null, 2));
        });

    });




    it("numberedFilename", function () {
        console.log(utils.numberedFilename('abc-U.txt', 1));
    });

});

