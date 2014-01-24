/*jslint node: true */
/*jslint todo: true */

'use strict';

var configurator = require('../lib/configurator.js'),
    path = require('path'),
    locales = require('./../locales/locales.js').locales,
    kindle4ntLocalizer = require('../lib/kindle4ntLocalizer.js'),
    appcfg = require('../weather-config.js'),
    request = require('./spec-config.js').request,
    processor = require('../lib/processor.js'),
    fn = require("when/function"),
    utils = require('../lib/utils.js');

//
//
//
describe("configurator", function () {

    var wfo = utils.createWfo(request);

    kindle4ntLocalizer.init(locales);

    configurator(appcfg);

    it("shouldn't be null or undefined", function () {
        expect(configurator).toBeDefined();
        expect(configurator).not.toBe(null);
    });

    it("should work", function () {

        var ready;

        runs(function () {

            ready = false;

            configurator.configure(wfo)
                .then(function (result) {
                    ready = true;
                    wfo = result;
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

    it("should has a SVG template", function () {

        var expected = appcfg.templatesPool.devices[request.device],
            actual = path.basename(wfo.cfg.filenames.svg.template);

        expect(expected).toEqual(actual);
    });

    it("should has a CSS file", function () {
        var expected = 'ru-kindle4nt.css',
            actual = path.basename(wfo.cfg.filenames.svg.cssFile);
        expect(expected).toEqual(actual);
    });

    processor.init(kindle4ntLocalizer);

    processor.process(wfo, 'ru');

});
