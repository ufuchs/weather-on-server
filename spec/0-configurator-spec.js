/*jslint node: true */
/*jslint todo: true */

'use strict';

var configurator = require('../lib/configurator.js'),
    path = require('path'),
    appcfg = require('../weather-config.js'),
    fn = require("when/function");
//    location = require('./spec-config.js').location;

//
//
//
describe("configurator", function () {

    var wfo,
        location = {
            id: 1,
            name: "Germany/Berlin",
            lang: "ru",
            device: "kindle4nt",
            period: 0

        };

    configurator(appcfg);

    it("shouldn't be null or undefined", function () {
        expect(configurator).toBeDefined();
        expect(configurator).not.toBe(null);
    });

    it("should work", function () {

        var ready;

        runs(function () {

            ready = false;

            configurator.configure(location)
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
            console.log('wfo.cfg : ', wfo.cfg);
        });

    });

    it("should has a SVG template", function () {

        var expected = appcfg.templatesPool.devices[location.device],
            actual = path.basename(wfo.cfg.filenames.svg.template);

        expect(expected).toEqual(actual);
    });

    it("should has a CCS file", function () {
        var expected = 'ru-kindle4nt.css',
            actual = path.basename(wfo.cfg.filenames.svg.cssFile);
        expect(expected).toEqual(actual);
    });

});
