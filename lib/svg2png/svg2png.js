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
    utils = require('../utils.js'),
    CFG = require('../../app-config.js');

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

function svgToPng(inSvg, outPng, cb) {

    var script = path.resolve(__dirname, "./converter.js"),

        args = utils.fillTemplates(CFG.cmd.phantomjs, {
            script: script,
            inSvg: inSvg,
            outPng: outPng
        });

    exec(args, function (err, stdout, stderr) {
        if (err) {
            cb(err);
        } else if (stdout.length > 0) { // PhantomJS always outputs to stdout.
            cb(new Error(stdout.toString().trim()));
        } else if (stderr.length > 0) { // But hey something else might get to stderr.
            cb(new Error(stderr.toString().trim()));
        } else {
            cb(null);
        }
    });

}
