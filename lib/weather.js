/*jslint node: true */
/*jslint todo: true */

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

var Q = require('q'),
    appcfg = require('./../weather-config.js'),
    downloader = require('./downloader.js'),
    wunderGround = require('./provider/wunderground.js'),
    demoWeather = require('./provider/wunderground-2013-03-29.json'),
    svgEngine = require('./svgEngine.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var weather = {

        // SANTIANO

        /**
         * Download weather data from provider and transforms it into a PNG file
         *
         * @param {proxy} String
         * @param {apikey} String
         * @param {cachettl} Integer
         *
         * @api public
         */

        prepare : function (proxy, cachettl) {

            var provider =  wunderGround();

            downloader.prepare(provider, proxy);
            svgEngine.prepare(provider);

            utils.moment_applyPatch_de();

        },

        //
        //
        //
        process : function (request, cb) {

            Q.when(utils.createWfo(request))
                .then(function (wfo) {
                    var result;
                    if (appcfg.useTestData) {
                        wfo.json = demoWeather;
                        result = wfo;
                    } else {
                        result = downloader.download(wfo);
                    }
                    return result;
                })
                .then(svgEngine.process)
                .then(function (fname) {
                    cb(null, fname);
                }, function (err) {
                    console.log(err);
                });

        }

    };

    /**
     * Expose `weather`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weather;
    }

}());
