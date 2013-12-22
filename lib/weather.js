/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weather
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

/**
 * Dependencies
 */

var when = require('when'),
    fn = require("when/function"),
    providerService = require('./providerService.js'),
    appcfg = require('./../weather-config.js'),
    localizer = require('./localizer.js'),
    configurator = require('./configurator.js'),
    utils = require('./utils.js'),
    svg2png = require('./svg2png/svg2png.js');

(function () {

    var weather,

        VERSION = "0.4.0";

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

    //
    //
    //
    function renderSvg(wfo) {

        var cfg = wfo.cfg,
            svgStream = wfo.svg,
            pngFilename = cfg.filenames.png.weatherPng;

        return svg2png.renderSvgFromStream(svgStream, pngFilename)
            .then(function () {
                return pngFilename;
            });

    }

    //
    //
    //
    function processWeatherdata(wfo) {

        var cfg = wfo.cfg,
            maxFiles = appcfg.production.files.quantity[cfg.location.device],
            files = [],
            orgPeriod = cfg.location.period,
            d = when.defer();

        //
        // @param {wfo} Object - the workflow object
        //
        function adjustFilenames(wfo) {

            var filenames = cfg.filenames.png;

            filenames.weatherPng =
                utils.numberedFilename(filenames.weatherPng, cfg.location.period);

            return wfo;

        }

        //
        //
        //
        function process(period) {

            if (period < maxFiles) {

                if (cfg.location.device === 'df3120') {
                    cfg.location.period = period;
                    adjustFilenames(wfo, period);
                }

                localizer.localize(wfo)
                    .then(populateSvgTemplate)
                    .then(renderSvg)
                    .then(function (filename) {
                        files.push(filename);
                        process(period + 1);
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

        process(0);

        return d.promise;

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Download weather data from provider and transforms it into a PNG file
     *
     * @param {proxy} String
     * @param {apikey} String
     * @param {cachettl} Integer
     *
     * @api public
     */

    weather = function (proxy, apikey, cachettl) {

        providerService(appcfg.provider, apikey, proxy);
        localizer(appcfg);
        configurator(appcfg);
        svg2png();

    };

    //
    //
    //
    weather.main = function (location, cb) {

        console.log('request', location.id + ':' + location.device + ':' + location.name);

        configurator.configure(location)
            .then(providerService.process)
            .then(processWeatherdata)
            .then(function (filenames) {

                var fname = filenames[location.period];
                location = null;
                cb(null, fname);
            }, function (err) {
                console.log(err);
            });

    };

    /**
     * Expose `weather`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weather;
    }

}());
