/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
    appcfg = require('../weather-config'),
    Bunyan = require('bunyan'),
    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    localizer = require('./df3120Localizer.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var df3120Processor;

    //
    //
    //
    function populateSvgTemplate(wfo) {

        var cfg = wfo.cfg,
            // work with a copy of the svg template
            svgTemplate = cfg.svgTemplate.substr(0, cfg.svgTemplate.length + 1),
            localized = wfo.localized;

        wfo.svg = utils.fillTemplates(svgTemplate, {

            // common
            css : cfg.filenames.svg.cssFile,
            tempUnit : localized.common.tempUnitToDisplay,
            min : localized.common.min,
            max : localized.common.max,

            // header
            date : localized.header.date,
            doy : localized.header.doy,
            dow0 : localized.header.forecast.name,
            // header/sun
            sr : localized.header.sun.sr,
            ss : localized.header.sun.ss,
            dl : localized.header.sun.dl + '   ' + localized.header.sun.dld,
            // header/forecast
            h0 : localized.header.forecast.temp.high,
            l0: localized.header.forecast.temp.low,
            ic0 : localized.header.forecast.ic,

            // footer
            update : localized.footer

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
    df3120Processor = function (locales) {
        localizer(locales);
    };

    //
    //
    //
    df3120Processor.process_local = function (wfo) {

        var d = when.defer();

        localizer.localize(wfo)
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
