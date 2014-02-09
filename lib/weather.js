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
    providerDAO = require('./providerDAO.js'),
    s3 = require('./s3.js'),
    storage = require('./storageDAO.js'),
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

            providerDAO.prepare(provider, s3, proxy);
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
//                    if (appcfg.useTestData) {
                    if (false) {
                        wfo.json = demoWeather;
                        result = wfo;
                    } else {
                        result = providerDAO.retrieve(wfo);
                    }
                    return result;
                })
                .then(this.saveJSON)
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
