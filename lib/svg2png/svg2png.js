/*jslint node: true */

/*!
 * svg2png
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * Partial Copyright(c) Domenic Denicola
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require("path"),
    exec = require("child_process").exec,
    when = require('when'),
    utils = require('../utils.js'),
    cfg = require('../../weather-config-vendor.js');

/**
 * Expose `svgToPng`.
 */

module.exports = svgToPng;

/**
 * Renders your populated SVG to a PNG file
 *
 * @param {inSvg}
 * @param {outPng}
 * @param {cb}
 * @api public
 */



function svgToPng(inSvg, outPng) {

    var script = path.resolve(__dirname, "./converter.js"),
        d = when.defer(),
        args = utils.fillTemplates(cfg.cmd.phantomjs, {
            script: script,
            inSvg: inSvg,
            outPng: outPng
        });

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
