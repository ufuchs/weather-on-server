/*jslint node: true */
/*jslint todo: true */

'use strict';

var renderer = require('../lib/svg2png-renderer.js'),
    path = require("path");


describe("renderer", function () {

    var data = path.resolve(__dirname, 'data/kindle4nt/1');

    it("shouldn't be null", function () {
        expect(renderer).not.toBe(null);
    });

    it("should render per 'renderSvgFile'", function () {

        var inSvg = data + '/' + 'weather.svg',
            outPng = data + '/' + 'weather.png';

        renderer.renderSvgFile(inSvg, outPng);
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

