/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
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
            utils.numberedFilename(filenames.weatherPng, cfg.location.period);

        return wfo;

    }

    ////////////////////////////////////////////////////////////////////////////

    //
    //
    //
    df3120Processor = function () {};

    //
    //
    //
    df3120Processor.process = function (wfo) {

        var cfg = wfo.cfg,
            maxFiles = 4, //appcfg.getFilesQuantity(cfg.location.device),
            files = [],
            orgPeriod = cfg.location.period,
            d = when.defer();

        //
        //
        //
        function process_local(period) {

            if (period < maxFiles) {

                cfg.location.period = period;
                adjustFilenames(wfo, period);

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
                        process_local(period + 1);
                    }, function (err) {
                        console.log(err);
                    });


            } else {

                cfg.location.period = orgPeriod;

                d.resolve(files);

                return;

            }
        }

        /*
        for (i = 0; i < maxFiles; i += 1) {

            if (params.location.device === 'df3120') {
                params.location.period = i;
                adjustFilenames(params);
            }

            fn.call(populateSvgTemplate, params)
                .then(writeResults)
                .then(function (filename) {
                    files.push(filename);
                });

        }

        params.location.period = orgPeriod;

        return files;
        */

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
