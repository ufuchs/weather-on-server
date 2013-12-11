/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * svg2png-renderer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Do not let Sunday be taken from you. If your soul has no Sunday, ]
 * [ it becomes an orphan.                      - Albert Schweitzer - ]
 */

/**
 * Dependencies
 */

var svg2png = require('./svg2png/svg2png.js'),
    exec = require('child_process').exec,
    cfg = require('./../weather-config-vendor.js'),
    utils = require('./utils.js');

/**
 * Expose `Kindel4NtRenderStrategy`.
 */

exports = module.exports = new RenderService();

// var app = exports = module.exports = {};

/**
 * Initialize a new `Kindel4NtRenderStrategy`.
 *
 * @api public
 */

var Renderer = function () {
    this.device = "";
};

Renderer.prototype = {

    setDevice : function (device) {
        this.device = device;
    },

    render : function (out) {
        return this.device.render(out);
    }

};

var DF3120Renderer = function () {

    this.render = function (out) {

        var CRUSH_CMD;

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            // The Kindel4NT needs crushed PNGs.
            // Without crushing you will see artifacts on the Kindle's screen
            CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                inPng: out.unweatherPng,
                outPng: out.weatherPng
            });

            exec(CRUSH_CMD, function (err, stdout, stderr) {
                callback(err, out.weatherPng);
            });

        });


    };
};

var Kindle4NTRenderer = function () {

    this.render = function (out) {

        var CRUSH_CMD;

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            // The Kindel4NT needs crushed PNGs.
            // Without crushing you will see artifacts on the Kindle's screen
            CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                inPng: out.unweatherPng,
                outPng: out.weatherPng
            });

            exec(CRUSH_CMD, function (err, stdout, stderr) {
                callback(err, out.weatherPng);
            });

        });

    };

};

function RenderService() {

    this.strategies = {};

    this.strategies.df3120 = {};
    this.strategies.df3120.doRender = function (out, callback) {

        var CRUSH_CMD;

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            // The Kindel4NT needs crushed PNGs.
            // Without crushing you will see artifacts on the Kindle's screen
            CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                inPng: out.unweatherPng,
                outPng: out.weatherPng
            });

            exec(CRUSH_CMD, function (err, stdout, stderr) {
                callback(err, out.weatherPng);
            });

        });

    };


    ///////////////////////////////////////////////////////////////////////////

    this.strategies.kindle4nt = {};
    this.strategies.kindle4nt.doRender = function (out, callback) {

        var CRUSH_CMD;

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            // The Kindel4NT needs crushed PNGs.
            // Without crushing you will see artifacts on the Kindle's screen
            CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                inPng: out.unweatherPng,
                outPng: out.weatherPng
            });

            exec(CRUSH_CMD, function (err, stdout, stderr) {
                callback(err, out.weatherPng);
            });

        });

    };

}


/**
 * Renders your populated SVG file
 *
 * @param {device} String
 * @param {out} Object
 * @param {callback} Function
 * @api public
 */
RenderService.prototype.render = function (params, callback) {

    var strategy = this.strategies[params.device];

    if (strategy === null) {
        throw new Error('unknown render strategy for ' + params.device);
    }

    strategy.doRender(params.out, callback);

};
