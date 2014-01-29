/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
    appcfg = require('../weather-config'),
//    Bunyan = require('bunyan'),
//    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    processor = require('./processor.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var df3120Processor = {};



    //
    // @param {wfo} Object - the workflow object
    //
    function adjustFilenames(wfo) {

        var cfg = wfo.cfg,
            filenames = cfg.device.png;

        filenames.weatherPng =
            utils.numberedFilename(filenames.weatherPng, cfg.request.period);

        return wfo;

    }

    ////////////////////////////////////////////////////////////////////////////

    //
    //
    //
    df3120Processor.process_local = function (wfo, dayNum) {

        var d = when.defer(),
            l = wfo.localized,
            c = wfo.cfg,
            p = processor.df3120;


//        p.prepare4Lang(wfo, isoLang);

        p.localize(wfo, dayNum)
            .then(p.populateSvgTemplate)
            .then(function (wfo) {
                d.resolve(svg2png.renderSvgFromStream(
                    wfo.svg,
                    wfo.cfg.device.png.weatherPng
                ));
            });

        return d.promise;

    };

    //
    //
    //
    df3120Processor.process = function (wfo, isoLang) {

        var cfg = wfo.cfg,
            maxFiles = appcfg.getFilesQuantity(cfg.request.device),
            files = [],
            orgPeriod = cfg.request.period,
            d = when.defer();

        function process_local(period) {

            if (period < maxFiles) {

                cfg.request.period = period;
                adjustFilenames(wfo, period);

                df3120Processor.process_local(wfo)
                    .then(function (filename) {
                        files.push(filename);
                        process_local(period + 1);
                    }, function (err) {
                        d.reject(err);
                    });

            } else {

                cfg.request.period = orgPeriod;

                d.resolve(files);

                return;

            }
        }

        processor.df3120.prepare(wfo, isoLang);

        process_local(0);

        return d.promise;

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = df3120Processor;
    }

}());
