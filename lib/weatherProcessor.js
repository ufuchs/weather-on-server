/*jslint node: true */
/*jslint todo: true */

var when = require('when'),
//    Bunyan = require('bunyan'),
//    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    svgEngine = require('./svgEngine.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var weatherProcessor = {};

    function doProcess(wfo, dayNum) {

        var d = when.defer();

        when(svgEngine.populateSvgTemplate(wfo, dayNum))
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream({
                    dayNum : dayNum,
                    crushed : wfo.cfg.png.crushed,
                    singleDayDisplay : wfo.cfg.png.singleDayDisplay,
                    svg : wfo.svg[dayNum],
                    targetDir : wfo.cfg.png.targetDir,
                    basename : wfo.cfg.png.basename
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

        arr.push(when(doProcess(wfo, 0)));

        return when.all(arr)
            .then(function (filenames) {
                return filenames;
            });
    }

    //
    //
    //
    weatherProcessor.process = function (wfo, isoLang) {

        return when(svgEngine.prepare4Lang(wfo, isoLang))
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
