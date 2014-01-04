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


var when = require('when'),
    Bunyan = require('bunyan'),
    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    localizer = require('./localizer.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var weatherProcessor;

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

            // tomorrow
            dow1 : localized.forecastday[1].name,
            h1 : localized.forecastday[1].temp.high,
            l1 : localized.forecastday[1].temp.low,
            ic1 : localized.forecastday[1].ic,

            // day after tomorrow
            dow2 : localized.forecastday[2].name,
            h2 : localized.forecastday[2].temp.high,
            l2 : localized.forecastday[2].temp.low,
            ic2 : localized.forecastday[2].ic,

            // // day after tommorow + 1
            dow3 : localized.forecastday[3].name,
            h3 : localized.forecastday[3].temp.high,
            l3 : localized.forecastday[3].temp.low,
            ic3 : localized.forecastday[3].ic,

            // footer
            update : localized.footer

        });

        return wfo;

    }

    weatherProcessor = function () {

    };


    weatherProcessor.process = function (wfo) {

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
