/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weatherProcessor
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

var kindle4ntProcessor = require('./kindle4ntProcessor.js'),
    utils = require('./utils.js');

(function () {

    var weatherProcessor,
        processors = {};

    //
    //
    //
    weatherProcessor = function () {

        utils.moment_applyPatch_de();

        kindle4ntProcessor();
        processors.kindle4nt = kindle4ntProcessor;
    };

    //
    //
    //
    weatherProcessor.process = function (wfo) {

        var cfg = wfo.cfg;

        /*

        var cfg = wfo.cfg,
            maxFiles = 1, //appcfg.getFilesQuantity(cfg.location.device),
            files = [],
            orgPeriod = cfg.location.period,
            d = when.defer();

        //
        //
        //
        function process(period) {

            if (period < maxFiles) {

                localizer.localize(wfo)
                    .then(populateSvgTemplate)
                    .then(function (wfo) {
                        return svg2png.renderSvgFromStream(
                            wfo.svg,
                            wfo.cfg.filenames.png.weatherPng
                        );
                    })
                    .then(function (filename) {
                        files.push(filename);
                        process(period + 1);
                    }, function (err) {
                        console.log(err);
                    });


            } else {

                cfg.location.period = orgPeriod;

                d.resolve(files);

                return;

            }
        }

        process(0);

        return d.promise;

            */

        return processors[cfg.location.device].process(wfo);

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
