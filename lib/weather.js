/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

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
    request = require('request'),
    demoWeather = require('./provider/wunderground-2013-03-29.json'),
//    s3 = require('./s3.js'),
//    storage = require('./storageDAO.js'),
    wunderGround = require('./provider/wunderground.js'),
    svgEngine = require('./svgEngine.js'),
    weatherDAO = require('./weatherDAO.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var weather;

    /************************************
        weather
    ************************************/

    weather = {

        // SANTIANO
        _weatherDAO : null,

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

            var weatherProvider =  wunderGround();

            this._weatherDAO = weatherDAO(weatherProvider, proxy);

            svgEngine.prepare(weatherProvider);

            utils.moment_applyPatch_de();

        },

        //
        //
        //
        process : function (request, cb) {

            var wdao = this._weatherDAO;

            function retrieveWeather(wfo) {
                return wdao[appcfg.weatherSource].call(wdao, wfo);
            }

            Q.when(utils.createWfo(request))
                .then(retrieveWeather)
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
