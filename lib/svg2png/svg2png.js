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
 * Dependencies
 */

var Q = require('q'),
    os = require('os'),
    utils = require('./../utils.js'),
    path = require("path"),
    exec = require("child_process").exec,
    fs = require('fs.extra');

(function () {

    var svg2png = {},

        script = path.resolve(__dirname, "./converter.js"),

        vendors = {
            phantomjs : "phantomjs {{script}} {{inSvg}} {{outPng}} {{scale}}",
            pngcrush : "pngcrush -c 0 {{inPng}} {{outPng}}"
        },

        lockChannel = os.platform() === 'darwin';

    /**
     * API mit 'pngcrush' abgleichen
     *
     * @param {inSvg}
     * @param {outPng}
     * @param {scale}
     * @api private
     */

    function phantomjs(inSvg, outPng, scale) {

        var d = Q.defer(),
            args = utils.fillTemplates(vendors.phantomjs, {
                script : script,
                inSvg : inSvg,
                outPng : outPng,
                scale : scale || 1.0
            });

        exec(args, function (err, stdout, stderr) {
            if (err) {
                d.reject(err);
            } else if (stdout.length > 0) {
                // PhantomJS always outputs to stdout.
                d.reject(new Error(stdout.toString().trim()));
            } else if (stderr.length > 0 && !lockChannel) {
                // But hey something else might get to stderr.
                d.reject(new Error(stderr.toString().trim()));
            } else {
                d.resolve(outPng);
            }

        });

        return d.promise;

    }

    /**
     *
     *
     * @param {p} Object
     * @api private
     */

    function pngcrush(p) {

        var d1 = Q.defer(),
            args = utils.fillTemplates(vendors.pngcrush, {
                inPng: p.inPng,
                outPng: p.outPng
            });

        exec(args, function (err, stdout, stderr) {

            if (err) {
                d1.reject(err);
            } else if (stderr.length > 0 && !lockChannel) {
                d1.reject(new Error(stderr.toString().trim()));
            } else {
                d1.resolve(p.outPng);
            }

        });

        return d1.promise;

    }

    /**
     * Renders your populated SVG to a PNG file
     *
     * @param {svgFilename}
     * @param {pngFilename}
     * @param {scale}
     * @api public
     */

    svg2png.renderSvgFromFile = function (svgFilename, p, scale) {

        // Append 'UC' to the `pngFilename`, e.g 'weatherUC.png'
        // UC means 'uncrushed'
        var pngFilenameUC = p.baseFilename + p.uc + p.fileNum + '.png';

        return phantomjs(svgFilename, pngFilenameUC, scale)
            .then(function () {
                return {
                    inPng : pngFilenameUC,
                    outPng : p.baseFilename + p.fileNum + '.png'
                };
            })
            .then(pngcrush);
    };

    /**
     * Renders your populated SVG to a PNG file
     *
     * @param {svgFilename}
     * @param {pngFilename}
     * @param {scale}
     * @api public
     */

    svg2png.renderSvgFromFileUC = function (svgFilename, pngFilename, scale) {
        return phantomjs(svgFilename, pngFilename, scale);
    };

    /**
     * Renders your populated SVG to a PNG file
     *
     * @param {svgStream}
     * @param {pngFilename}
     * @param {scale}
     * @api public
     */

    svg2png.renderSvgFromStream = function (p, scale) {

        var x = {
                fileNum : p.singleDayDisplay ? '-' + p.dayNum : '',
                uc : p.crushed ? 'UC' : '',
                baseFilename : p.baseFilename
            },
            svgFilename = x.baseFilename + x.fileNum + '.svg',
            d = Q.defer();

        fs.writeFile(svgFilename, p.svg, function (err) {
            if (err) {
                d.reject(err);
            } else {
                d.resolve(svg2png.renderSvgFromFile(svgFilename, x, scale));
            }
        });

        return d.promise;

    };

    /**
     * Renders your populated SVG to a PNG file
     *
     * @param {svgStream}
     * @param {pngFilename}
     * @param {scale}
     * @api public
     */

    svg2png.renderSvgFromStreamUC = function (svgStream, pngFilename, scale) {

        var basename = path.basename(pngFilename, '.png') + '.svg',
            dirname = path.dirname(pngFilename),
            svgFilename = path.join(dirname, basename),
            d = Q.defer();

        fs.writeFile(svgFilename, svgStream, function (err) {

            if (err) {
                d.reject(err);
            } else {
                d.resolve(svg2png.renderSvgFileUC(svgFilename, pngFilename, scale));
            }

        });

        return d.promise;

    };

    /**
     * Expose `svg2pngRenderer`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = svg2png;
    }

}());
