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

        // Filenmes sind noch zu bauen

        when(p.populateSvgTemplate(wfo, dayNum))
            .then(function (wfo) {
                return (svg2png.renderSvgFromStream(
                    wfo.svg[dayNum],
                    wfo.cfg.device.png.weatherPng
                ));
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

        function wrapper(wfo, dayNum) {
            return when(doProcess(wfo, dayNum));
        }

        arr.push(wrapper(wfo, 0));

        return when.all(arr)
            .then(function (filenames) {
                return filenames;
            });
    }


    //
    //
    //
    kindle4ntProcessor.process = function (wfo, isoLang) {

        var p = processor.kindle4nt;

        return when(p.prepare4Lang(wfo, isoLang))
            .then(p.localize.bind(p))
            .then(x)
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
