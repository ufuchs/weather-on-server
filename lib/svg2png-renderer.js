/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * svg2png-renderer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var svg2png = require('./svg2png/svg2png.js'),
    exec = require('child_process').exec,
    CFG = require('./../app-config.js'),
    utils = require('./utils.js');

/**
 * Expose `Kindel4NtRenderStrategy`.
 */

exports = module.exports = new RenderService();

/** 
 * Initialize a new `Kindel4NtRenderStrategy`.
 *
 * @api public
 */

function RenderService() {


    this.strategies = {
        df3120 : {
            doRender : function (out, callback) {

                svg2png(out.weatherSvg, out.weatherPng, function (err) {

                    if (err) {
                        callback(null, err);
                    } else {
                        callback(out.weatherPng, null);
                    }

                });

            }
        },
        kindle4nt : {
            doRender : function (out, callback) {

                var CRUSH_CMD;

                svg2png(out.weatherSvg, out.unweatherPng, function (err) {

                    if (err) {
                        console.log(err);
                        callback(null, err);
                        return;
                    }

                    // The Kindel4NT needs crushed PNGs.
                    // Without crushing you will see artifacts on the Kindle's screen
                    CRUSH_CMD = utils.fillTemplates(CFG.cmd.pngcrush, {
                        inPng: out.unweatherPng,
                        outPng: out.weatherPng
                    });

                    exec(CRUSH_CMD, function (err, stdout, stderr) {
                        callback(out.weatherPng, err);
                    });

                });

            }
        }
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
RenderService.prototype.render = function (device, out, callback) {

    var strategy = this.strategies[device];

    if (strategy === null ) {
        throw new Error('unknown render strategy for ' + device);
    }

    strategy.doRender(out, callback);

};
