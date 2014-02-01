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

        var deferred = Q.defer(),
            d = wfo.cfg.display;

        Q.when(svgEngine.populateSvgTemplate(wfo, dayNum))
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream({
                    dayNum : dayNum,
                    crushed : d.crushed,
                    singleDayDisplay : d.singleDayDisplay,
                    svg : wfo.svg[dayNum],
                    targetDir : d.targetDir,
                    basename : d.basename
                }));
            })
            .then(function (filename) {
                deferred.resolve(filename);
            }, function (err) {
                deferred.reject(err);
            });

        return deferred.promise;

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
