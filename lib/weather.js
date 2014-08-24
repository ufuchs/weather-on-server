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
    astro = require('../lib/astro.js'),
    wunderGround = require('./provider/wunderground.js'),
    svgEngine = require('./svgEngine.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var weather,
        weatherDAO;

    /************************************
        WeatherDAO
    ************************************/

    function WeatherDAO(weatherProvider, proxy) {
        this.weatherProvider = weatherProvider;
        this.proxy = proxy;
    }

    WeatherDAO.prototype.byTestData = function (req) {
        return {
            request : req,
            json : demoWeather
        };
    };

    /**
     * partial copyright(c) Vincent Schoettke
     *
     * Submits a request and fetchs the response, the weather data.
     *
     * @param {params} data object
     * @return data object
     *
     * @api public
     */

    WeatherDAO.prototype.byProvider = function (req) {

        var uri = this.weatherProvider.getApiUri(req.lang, req.name),
            d = Q.defer();

//        console.log(uri);

        request({uri : uri, proxy : this.proxy}, function (err, res, body) {

            if (err) {
                d.reject(err);
            } else {
                try {
                    d.resolve({
                        request : req,
                        json : JSON.parse(body)
                    });
                } catch (jsonErr) {
                    d.reject(jsonErr);
                }
            }
        });

        return d.promise;

    };

    weatherDAO = function (weatherProvider, proxy) {
        return new WeatherDAO(weatherProvider, proxy);
    };

    /************************************
        weather
    ************************************/

    weather = {

        // SANTIANO
        weatherDAO : null,

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

            var astroProvider = astro(),
                weatherProvider =  wunderGround(astroProvider);

            this.weatherDAO = weatherDAO(weatherProvider, proxy);

            svgEngine.prepare(weatherProvider);

            utils.moment_applyPatch_de();

        },

        //
        //
        //
        process : function (request, cb) {

            var wdao = this.weatherDAO;

            function retrieveWeather(req) {
                return wdao[appcfg.weatherSource].call(wdao, req);
            }

            Q.when(retrieveWeather(request))
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
