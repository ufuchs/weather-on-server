/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * svg2png-rendererEx
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Do not let Sunday be taken from you. If your soul has no Sunday, ]
 * [ it becomes an orphan.                      - Albert Schweitzer - ]
 */

/**
 * Hints from the web.
 *
 * http://addyosmani.com/resources/essentialjsdesignpatterns/book/#prototypepatternjavascript
 * http://www.dofactory.com/javascript-strategy-pattern.aspx
 *
 */

/**
 * Dependencies
 */

var svg2png = require('./svg2png/svg2png.js'),
    when = require('when'),
    fn = require("when/function"),
    utils = require('./utils.js'),
    path = require("path"),
    exec = require("child_process").exec,
    fs = require('fs.extra');

(function () {

    var svg2pngRenderer,

        script = path.resolve(__dirname, "./svg2png/converter.js"),

        vendors = {
            phantomjs : 'phantomjs {{script}} {{inSvg}} {{outPng}} {{scale}}',
            pngcrush : 'pngcrush -c 0 {{inPng}} {{outPng}}'
        };

    //
    //
    //
    function phantomjs(inSvg, outPng, scale) {

        var d = when.defer(),
            args = utils.fillTemplates(vendors.phantomjs, {
                script : script,
                inSvg : inSvg,
                outPng : outPng,
                scale : scale || 1.0
            });

        console.log(args);

        exec(args, function (err, stdout, stderr) {
            if (err) {
                d.reject(err);
            } else if (stdout.length > 0) { // PhantomJS always outputs to stdout.
                d.reject(new Error(stdout.toString().trim()));
            } else if (stderr.length > 0) { // But hey something else might get to stderr.
                d.reject(new Error(stderr.toString().trim()));
            } else {
                d.resolve(outPng);
            }

        });

        return d.promise;

    }

    //
    //
    //

    function pngcrush(p) {

        var d1 = when.defer(),
            // `args` rausziehen
            args = utils.fillTemplates(vendors.pngcrush, {
                inPng: p.inPng,
                outPng: p.outPng
            });

        exec(args, function (err, stdout, stderr) {

            if (err) {
                d1.reject(err);
            } else if (stderr.length > 0) {
                d1.reject(new Error(stderr.toString().trim()));
            } else {
                d1.resolve(outPng);
            }

        });

        return d1.promise;

    }

    svg2pngRenderer = function () {

    };

    //
    //
    //
    svg2pngRenderer.renderSvgFile = function (inSvg, outPng, scale) {

        var s = 'UC' + path.basename(outPng),
            t = path.dirname(outPng),
            unweatherPng = t + '/' + s;


        console.log(unweatherPng);

        return fn.call(phantomjs, inSvg, unweatherPng, scale)
            .then(function (unweatherPng) {
                return {inPng : unweatherPng, outPng : outPng};
            })
            .then(pngcrush);

    };

    //
    //
    //
    svg2pngRenderer.renderSvgFileUC = function (inSvg, outPng, scale) {
        return fn.call(phantomjs, inSvg, outPng, scale);
    };

    //
    //
    //
    svg2pngRenderer.renderSvgStream = function (inSvg, outPng, scale) {

        var svgFilename = null,
            d = when.defer();

        fs.writeFile(svgFilename, inSvg, function (err) {

            if (err) {
                d.reject(err);
            } else {
                d.resolve(this.renderSvgFile(svgFilename, outPng, scale));
            }

        });

        return d.promise;

    };

    //
    //
    //
    svg2pngRenderer.renderSvgStreamUC = function (inSvg, outPng, scale) {

        var svgFilename = null,
            d = when.defer();

        // main
        fs.writeFile(svgFilename, inSvg, function (err) {

            if (err) {
                d.reject(err);
            } else {
                d.resolve(this.renderSvgFileUC(svgFilename, outPng, scale));
            }

        });

        return d.promise;

    };

    /**
     * Expose `svg2pngRenderer`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = svg2pngRenderer;
    }

}());







