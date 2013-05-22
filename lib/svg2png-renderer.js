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
 * Initialize a new `Renderer` with the given `strategy` object.
 *
 * @api public
 */

function Renderer() {
    this.strategy = null;
}

/** 
 * Sets a new `strategy` object on run time.
 *
 * @param {strategy} Object
 * @api public
 */

Renderer.prototype.setStrategy = function (strategy) {
    this.strategy = strategy;
};

/** 
 * Invoke the given `strategy'.
 *
 * Renderer provides a render function that is going to
 * render SVG to PNG using the Strategy passed to the constructor
 * or to `setStrategy`.
 *
 * @param {out} Object
 * @param {callback} Function
 * @return {strategy.execute()} Function
 * @api private
 */

Renderer.prototype.render = function (out, callback) {
    return this.strategy.execute(out, callback);
};

///////////////////////////////////////////////////////////////////////////////

/** 
 * Initialize a new `Strategy`.
 *
 * @param {strategy}
 * @api private, abstract
 */

function Strategy() {}

/** 
 * Invokes the `execute' methode of the concrete strategy.
 * Must be overridden.
 *
 * @param {out} Object
 * @param {callback} Function
 * @api private
 */

Strategy.prototype.execute = function (out, callback) {
    throw new Error('Strategy#execute needs to be overridden.');
};

///////////////////////////////////////////////////////////////////////////////

/** 
 * Initialize a new `RenderStrategy`.
 *
 * @api private
 */

function RenderStrategy() {}
RenderStrategy.prototype = Object.create(Strategy.prototype);

/** 
 * Invokes the `execute' methode of the concrete strategy.
 * Uses the `Template Method` pattern.
 *
 * @param {out} Object
 * @param {callback} Function
 * @api private
 */

RenderStrategy.prototype.execute = function (out, callback) {
    return this.doRender(out, callback);
};

///////////////////////////////////////////////////////////////////////////////

/** 
 * Initialize a new `Df3120RenderStrategy`.
 *
 * @api private
 */

function Df3120RenderStrategy() {}
Df3120RenderStrategy.prototype = Object.create(RenderStrategy.prototype);

/** 
 * Renders the SVG for the DF3120.
 *
 * @param {out} Object
 * @param {callback} Function
 * @api private
 */

Df3120RenderStrategy.prototype.doRender = function (out, callback) {

    svg2png(out.weatherSvg, out.weatherPng, function (err) {

        if (err) {
            callback(null, err);
        } else {
            callback(out.weatherPng, null);
        }

    });

};

///////////////////////////////////////////////////////////////////////////////

/** 
 * Initialize a new `Kindel4NtRenderStrategy`.
 *
 * @api private
 */

function Kindel4NtRenderStrategy() {}
Kindel4NtRenderStrategy.prototype = Object.create(RenderStrategy.prototype);

/** 
 * Renders the SVG for the Kindel 4 Non Touch.
 *
 * @param {out} Object
 * @param {callback} Function
 * @api private
 */

Kindel4NtRenderStrategy.prototype.doRender = function (out, callback) {

    var CRUSH_CMD;

    svg2png(out.weatherSvg, out.unweatherPng, function (err) {

        if (err) {
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

};

///////////////////////////////////////////////////////////////////////////////

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
    this.renderer = new Renderer();
    this.strategies = {
        df3120 : new Df3120RenderStrategy(),
        kindle4nt : new Kindel4NtRenderStrategy()
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

    var strategy = null;

    strategy = this.strategies[device];

    if (strategy === null) {
        throw new Error('unknown device strategy');
    }

    this.renderer.setStrategy(strategy);

    this.renderer.render(out, callback);

};
