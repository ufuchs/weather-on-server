/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
//    Bunyan = require('bunyan'),
//    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    processor = require('./processor.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var kindle4ntProcessor = {};


    function doProcess(wfo, dayNum) {

        var d = when.defer(),
            p = processor.kindle4nt;


        p.localize(wfo, dayNum)
            .then(p.populateSvgTemplate)
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream(
                    wfo.svg,
                    wfo.cfg.filenames.png.weatherPng
                ));
            })
            .then(function (filename) {
                d.resolve(filename);
            }, function (err) {
                d.reject(err);
            });

        return d.promise;

    }

    //
    //
    //
    kindle4ntProcessor.process = function (wfo, isoLang) {

        var p = processor.kindle4nt;

        p.prepare4Lang(wfo, isoLang);

        return when.join(doProcess(wfo))
            .then(function (filenames) {
                return filenames;
            });

    };

    /**
     * Expose `kindle4ntProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = kindle4ntProcessor;
    }

}());
