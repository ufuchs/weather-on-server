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

    function doProcess(wfo, dayNum) {

        var d = wfo.cfg.display;

        return Q.when(svgEngine.populateSvgTemplate(wfo, dayNum))
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream({
                    svg : wfo.svg[dayNum],
                    dayNum : dayNum,
                    crushed : d.crushed,
                    singleDayDisplay : d.singleDayDisplay,
                    baseFilename : d.baseFilename
                }));
            });

    }

    function x(wfo) {

        var arr = [];

        arr.push(Q.when(doProcess(wfo, 0)));

        return Q.all(arr);

    }

    //
    //
    //
    weatherProcessor.process = function (wfo, isoLang) {
        return Q.when(svgEngine.prepare4Lang(wfo, isoLang))
            .then(svgEngine.localize.bind(svgEngine))
            .then(x);
    };

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
