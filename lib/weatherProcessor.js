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

        var d = Q.defer();

        Q.when(svgEngine.populateSvgTemplate(wfo, dayNum))
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream({
                    dayNum : dayNum,
                    crushed : wfo.cfg.display.crushed,
                    singleDayDisplay : wfo.cfg.display.singleDayDisplay,
                    svg : wfo.svg[dayNum],
                    targetDir : wfo.cfg.display.targetDir,
                    basename : wfo.cfg.display.basename
                }));
            })
            .then(function (filename) {
                d.resolve(filename);
            }, function (err) {
                d.reject(err);
            });

        return d.promise;

    }

    function x(wfo) {

        var arr = [];

        arr.push(Q.when(doProcess(wfo, 0)));

        return Q.all(arr)
            .then(function (filenames) {
                return filenames;
            });
    }

    //
    //
    //
    weatherProcessor.process = function (wfo, isoLang) {

        return Q.when(svgEngine.prepare4Lang(wfo, isoLang))
            .then(svgEngine.localize.bind(svgEngine))
            .then(x)
            .then(function (filenames) {
                return filenames;
            });

    };

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
