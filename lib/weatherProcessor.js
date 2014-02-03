/*jslint node: true */
/*jslint todo: true */

var Q = require('q'),
//    Bunyan = require('bunyan'),
//    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    svgEngine = require('./svgEngine.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var weatherProcessor = {};

    //
    //
    //
    weatherProcessor.process = function (wfo, isoLang) {

        var dayNum = wfo.cfg.request.period;

        return Q.when(svgEngine.prepare4Lang(wfo, isoLang))
            .then(svgEngine.localize.bind(svgEngine))
            .then(svgEngine.populateSvgTemplate.bind(svgEngine, wfo, dayNum))
            .then(svgEngine.render.bind(svgEngine));
    };

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
