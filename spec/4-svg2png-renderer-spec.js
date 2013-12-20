/*jslint node: true */
/*jslint todo: true */

'use strict';

var renderer = require('../lib/svg2png/svg2png.js'),
    fn = require("when/function"),
    utils = require('../lib/utils.js'),
    path = require("path");

describe("renderer", function () {

    var kindle = path.resolve(__dirname, '../public/weather/kindle4nt/test'),
        i,
        svg;


    it("load test SVG for stream test", function () {

        var ready;

        runs(function () {
            ready = false;
            utils.readTextFile(path.join(kindle, 'weather.svg'), function (data) {
                svg = data;
                ready = true;
            });

        });


        waitsFor(function() {
            return ready;
        }, "'readTextFile' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);

        });


    });

    it("shouldn't be null", function () {
        expect(renderer).not.toBe(null);
    });

    it("should render per 'renderSvgFile'", function () {

        var inSvg = path.join(kindle, 'weather.svg'),
            outPng = path.join(kindle, 'weather.png'),
            ready;

        runs(function () {

            fn.call(renderer.renderSvgFromFile, inSvg, outPng)
                .then(function () {
                    ready = true;
                }, function (err) {
                    console.log(err);
                });

        });

        waitsFor(function() {
            return ready;
        }, "'renderer' timed out",2000);

        runs(function() {
            expect(ready).toEqual(true);

        });

    });

    it("should render per 'renderSvgFromStream'", function () {

        var inSvg = kindle + '/' + 'weather.svg',
            outPng = kindle + '/' + 'weather.png',
            ready;

        runs(function () {

            fn.call(renderer.renderSvgFromStream, svg, outPng)
                .then(function () {
                    ready = true;
                }, function (err) {
                    console.log(err);
                });

        });

        waitsFor(function() {
            return ready;
        }, "'renderer' timed out",2000);

        runs(function() {
            expect(ready).toEqual(true);

        });

    });

});

