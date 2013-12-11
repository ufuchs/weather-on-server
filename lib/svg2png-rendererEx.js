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

var svg2png = require('./svg2png/svg2png.js'),
    exec = require('child_process').exec,
    cfg = require('./../weather-config-vendor.js'),
    when = require('when'),
    utils = require('./utils.js');

/**
 * Expose `renderer`.
 */

// http://www.dofactory.com/javascript-strategy-pattern.aspx
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

//

var DF3120Renderer = function () {

    this.render = function (out) {
        console.log('DF3120Renderer');
    };
};

//

var Kindle4NTRenderer = function () {

    this.render = function (out) {
        console.log('Kindle4NTRenderer');
    };

};

//

function RenderServiceEx() {

    this.df3120 = new DF3120Renderer();
    this.kindle4nt = new Kindle4NTRenderer();

}

RenderServiceEx.prototype.render = function (params) {

    var renderer = new Renderer();

    renderer.setDevice(params.device);

    return renderer.render(params.out);
};

module.exports.renderer = new RenderServiceEx();
