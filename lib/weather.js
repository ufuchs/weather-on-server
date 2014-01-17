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
    fs = require('fs'),
    fn = require("when/function"),
    dataProvider = require('./dataProvider.js'),
    appcfg = require('./../weather-config.js'),
    weatherProcessor = require('./weatherProcessor.js'),
    locales = require('./../locales/locales.js').locales,
    configurator = require('./configurator.js'),
    utils = require('./utils.js'),
    svg2png = require('./svg2png/svg2png.js');

(function () {

    var weather,

        VERSION = "0.4.0";

        // SANTIANO

    function createWfo(request) {

        return {
            cfg : {
                svgTemplate : null,
                request : request,
                filenames : {
                    svg : {},
                    png : {}
                }

            },
            json : null,
            weather : {},
            localized : {
                common : {},
                header : {
                    date : null,
                    doy : null,
                    forecast : {}
                },
                forecastday : []
            }
        };

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

        dataProvider(appcfg.provider, apikey, proxy);
        weatherProcessor(locales);
        configurator(appcfg);
        svg2png();

    };

    //
    //
    //
    weather.main = function (request, cb) {

        console.log('request', request.id + ':' + request.device + ':' + request.name);

        when(createWfo(request))
            .then(dataProvider.process)
            .then(configurator.configure)
            /*
            .then(function (wfo) {

                var d = when.defer(),
                    s = JSON.parse(wfo.weather);

                console.log(s);

                fs.writeFile('./Teeeest.js', s, function (err) {

                    console.log('./Teeeest.js');

                    if (err) {
                        d.reject(err);
                    } else {
                        d.resolve(wfo);
                    }

                });

                return d.promise;

            }, function (err) {
                console.log(err);
            })
            */
            .then(weatherProcessor.process)
            .then(function (filenames) {
                var fname = filenames[request.period];
                request = null;
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
