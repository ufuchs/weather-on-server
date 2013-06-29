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
    CFG = require('./../weather-config.js'),
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
                        callback(err, null);
                    } else {
                        callback(null, out.weatherPng);
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
                        callback(err, null);
                        return;
                    }

                    // The Kindel4NT needs crushed PNGs.
                    // Without crushing you will see artifacts on the Kindle's screen
                    CRUSH_CMD = utils.fillTemplates(CFG.cmd.pngcrush, {
                        inPng: out.unweatherPng,
                        outPng: out.weatherPng
                    });

                    exec(CRUSH_CMD, function (err, stdout, stderr) {
                        callback(err, out.weatherPng);
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
RenderService.prototype.render = function (params, callback) {

    console.log(params);

    var strategy = this.strategies[params.device];

    if (strategy === null) {
        throw new Error('unknown render strategy for ' + params.device);
    }

    strategy.doRender(params.out, callback);

};
