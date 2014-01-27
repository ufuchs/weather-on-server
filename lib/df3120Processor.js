/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
    appcfg = require('../weather-config'),
//    Bunyan = require('bunyan'),
//    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    localizer = require('./processor.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var df3120Processor = {},
        df3120Localizer = localizer.df3120;

    //
    //
    //
    function populateSvgTemplate(wfo) {

        var l = wfo.localized,
            c = wfo.cfg,
            // get a copy from the origin
            copied = c.svgTemplate.substr(0, c.svgTemplate.length + 1);

        wfo.svg = utils.fillTemplates(copied, {

            css : c.filenames.svg.cssFile,

            // common
            tempUnit : l.common.tempUnitToDisplay,
            min : l.common.min,
            max : l.common.max,

            // header
            date : l.header.date,
            doy : l.header.doy,

            // header.forecast.sun
            sr : l.header.forecast.sun.sr,
            ss : l.header.forecast.sun.ss,
            dl : l.header.forecast.sun.dl + '   ' + l.header.forecast.sun.dld,

            // header.forecast
            dow0 : l.header.forecast.name,
            h0 : l.header.forecast.temp.high,
            l0: l.header.forecast.temp.low,
            ic0 : l.header.forecast.ic,

            // footer
            update : l.footer

        });

        return wfo;

    }

    //
    // @param {wfo} Object - the workflow object
    //
    function adjustFilenames(wfo) {

        var cfg = wfo.cfg,
            filenames = cfg.filenames.png;

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
            c = wfo.cfg;


        df3120Localizer.prepare4Lang(wfo, isoLang);

        df3120Localizer.localize(wfo, dayNum)
            .then(populateSvgTemplate)
            .then(function (wfo) {
                d.resolve(svg2png.renderSvgFromStream(
                    wfo.svg,
                    wfo.cfg.filenames.png.weatherPng
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

        localizer.prepare(wfo, isoLang);

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
