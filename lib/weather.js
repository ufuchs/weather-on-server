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

var fs = require('fs.extra'),
    when = require('when'),
    nodefn = require("when/node/function"),
    fn = require("when/function"),
    wunderground = require('./provider/wunderground.js'),
    cfg = require('./../weather-config.js'),
    localizer = require('./localizer.js'),
    filenames = require('./filenames.js'),
    utils = require('./utils.js'),
    renderer = require('./svg2png-renderer.js');

(function () {

    var weather,

        VERSION = "0.4.0";

    //
    //
    //
    function populateSvgTemplate(wfo) {

        var svgTemplate = wfo.svgTemplate.substr(0, wfo.svgTemplate.length + 1), // make a copy
            localized = wfo.localized;

        wfo.svg = utils.fillTemplates(svgTemplate, {

            // common
            css : wfo.filenames['in'].cssFile,
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
    function writeResults(wfo) {

        var deferred = when.defer();

        fs.writeFile(wfo.filenames.out.weatherSvg, wfo.svg, function (err) {

            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(renderer.render(wfo.location.device, wfo.filenames.out));
            }

        });

        return deferred.promise;

    }

    //
    //
    //
    function processWeatherdata(wfo) {

        var maxFiles = cfg.production.files.quantity[wfo.location.device],
            files = [],
            orgPeriod = wfo.location.period,
            deferred = when.defer();

        //
        // @param {wfo} Object - the workflow object
        //
        function adjustFilenames(wfo) {

            var filenames = wfo.filenames.out;

            filenames.weatherSvg =
                utils.numberedFilename(filenames.weatherSvg, wfo.location.period);

            filenames.unweatherPng =
                utils.numberedFilename(filenames.unweatherPng, wfo.location.period);

            filenames.weatherPng =
                utils.numberedFilename(filenames.weatherPng, wfo.location.period);

            return wfo;

        }

        //
        //
        //
        function process(period) {

            if (period < maxFiles) {

                if (wfo.location.device === 'df3120') {
                    wfo.location.period = period;
                    adjustFilenames(wfo, period);
                }

                fn.call(localizer.localize, wfo)
                    .then(populateSvgTemplate)
                    .then(writeResults)
                    .then(function (filename) {
                        files.push(filename);
                        process(period + 1);
                    });


            } else {

                wfo.location.period = orgPeriod;

                deferred.resolve(files);

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

        return deferred.promise;

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

        wunderground(proxy, apikey, cachettl);
        localizer(cfg);
        filenames(cfg);

    };

    //
    //
    //
    weather.main = function (location, cb) {

        var now = new Date();

        fn.call(filenames.get, location)
            .then(nodefn.lift(wunderground.getWeather))
            .then(processWeatherdata)
            .then(function (filenames) {
                console.log('USING NEW DATA at ' + now + ' ' + location.id + ':' + location.name + ':' + filenames[location.period]);
                var fname = filenames[location.period];
                location = null;
                cb(null, fname);
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
