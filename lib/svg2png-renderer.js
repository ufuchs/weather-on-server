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
    exec = require('child_process').exec,
    vendors = require('./../weather-config-vendor.js'),
    when = require('when'),
    utils = require('./utils.js');

/**
 * Renderer for the DF3120 device
 *
 * @api private
 */

var DF3120Renderer = function () {

    this.render = function (out) {

        var CRUSH_CMD,
            deferred = when.defer();

        svg2png(out.weatherSvg, out.unweatherPng, function (err) {

            if (err) {
                deferred.reject(err);
            } else {

                // In this case reduce the size of the PNG
                CRUSH_CMD = utils.fillTemplates(vendors.cmd.pngcrush, {
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

/**
 * Renderer for the Kindle4 NT device
 *
 * @api private
 */

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
                CRUSH_CMD = utils.fillTemplates(vendors.cmd.pngcrush, {
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

/**
 * Prototype the render for a given device.
 *
 * @api public
 */

var rendererPrototype = {

    render : function (device, out) {
        return this[device].render(out);
    },

    init : function () {
        this.df3120 = new DF3120Renderer();
        this.kindle4nt = new Kindle4NTRenderer();
    }

};

/**
 * Manages the use of a device renderer by a given `device' per prototype
 *
 * @api public
 */

function renderer() {

    function F() {};
    F.prototype = rendererPrototype;

    var f = new F();

    f.init();
    return f;

}

var renderer = renderer();

/**
 * Expose `renderer`.
 */

exports = module.exports = renderer;








