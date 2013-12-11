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
    when = require('when'),
    utils = require('./utils.js');

/**
 * Expose `Kindel4NtRenderStrategy`.
 */

//exports = module.exports = new RenderService();

exports = module.exports = new RenderServiceEx();

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

        var CRUSH_CMD,
            deferred = when.defer();

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                deferred.reject(err);
            } else {

                // In this case reduce the size of the PNG
                CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                    inPng: out.unweatherPng,
                    outPng: out.weatherPng
                });

                exec(CRUSH_CMD, function (err, stdout, stderr) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(out.weatherPng);
                    }

                });

            }

        });

        return deferred.promise;

    };
};

var Kindle4NTRenderer = function () {

    this.render = function (out) {

        var CRUSH_CMD,
            deferred = when.defer();

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                deferred.reject(err);
            } else {

                // The Kindel4NT needs crushed PNGs.
                // Without crushing you will see artifacts on the Kindle's screen
                CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                    inPng: out.unweatherPng,
                    outPng: out.weatherPng
                });

                exec(CRUSH_CMD, function (err, stdout, stderr) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(out.weatherPng);
                    }

                });
            }

        });

        return deferred.promise;

    };

};

function RenderServiceEx() {

    var x = new df3120Renderer();

    this.df3120 = null; //new DF3120Renderer();
    this.kindle4nt = new Kindle4NTRenderer();

}

RenderServiceEx.prototype.render = function (params) {

    var renderer = new Renderer();

    renderer.setDevice(params.device);

    return renderer.render(params.out);
};


function RenderService() {

    this.strategies = {};

    this.strategies.df3120 = {};
    this.strategies.df3120.doRender = function (out) {

        var CRUSH_CMD,
            deferred = when.defer();

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                deferred.reject(err);
            } else {

                // In this case reduce the size of the PNG
                CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                    inPng: out.unweatherPng,
                    outPng: out.weatherPng
                });

                exec(CRUSH_CMD, function (err, stdout, stderr) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(out.weatherPng);
                    }

                });

            }

        });

        return deferred.promise;

    };


    ///////////////////////////////////////////////////////////////////////////

    this.strategies.kindle4nt = {};
    this.strategies.kindle4nt.doRender = function (out) {

        var CRUSH_CMD,
            deferred = when.defer();

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                deferred.reject(err);
            } else {

                // The Kindel4NT needs crushed PNGs.
                // Without crushing you will see artifacts on the Kindle's screen
                CRUSH_CMD = utils.fillTemplates(cfg.cmd.pngcrush, {
                    inPng: out.unweatherPng,
                    outPng: out.weatherPng
                });

                exec(CRUSH_CMD, function (err, stdout, stderr) {

                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(out.weatherPng);
                    }

                });
            }

        });

        return deferred.promise;

    };

}

/**
 * Renders your populated SVG file
 *
 * @param {device} String
 * @param {out} Object
 * @return {String}
 * @api public
 */
RenderService.prototype.render = function (params) {
    return this.strategies[params.device].doRender(params.out);
};
