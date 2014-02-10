/*jslint node: true */
/*jslint todo: true */

/*!
 * weatherDAO
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 * [ A pessimist sees the difficulty in every opportunity; an optimist ]
 * [ sees the opportunity in every difficulty.   - Winston Churchill - ]
 */

var request = require('request'),
    demoWeather = require('./provider/wunderground-2013-03-29.json'),
    Q = require('q');

(function () {

    'use strict';

    var weatherDAO;

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

    /**
     * Expose `provider`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherDAO;
    }

}());



