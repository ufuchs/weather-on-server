/*jslint node: true */
/*jslint todo: true */

'use strict';

var renderer = require('../lib/svg2png-renderer.js'),
    path = require("path");


describe("renderer", function () {

    var kindle = path.resolve(__dirname, '../public/weather/kindle4nt/test');

    it("shouldn't be null", function () {
        expect(renderer).not.toBe(null);
    });

    it("should render per 'renderSvgFile'", function () {

        var inSvg = kindle + '/' + 'weather.svg',
            outPng = kindle + '/' + 'weather.png';

        renderer.renderSvgFromFile(inSvg, outPng);
        expect(renderer).not.toBe(null);

    });

    /*
    it("should render per 'renderSvgFileUC'", function () {

        var inSvg = data + '/' + 'weather.svg',
            outPng = data + '/' + 'weatherUC.png';

        renderer.renderSvgFile(inSvg, outPng);
        expect(renderer).not.toBe(null);

    });
    */


});

