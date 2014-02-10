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

    function WeatherDAO(aWeatherProvider, aProxy) {
        this.weatherProvider = aWeatherProvider;
        this.proxy = aProxy;
    }

    WeatherDAO.prototype.byTestData = function (wfo) {
        wfo.json = demoWeather;
        return wfo;
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

    WeatherDAO.prototype.byProvider = function (wfo) {

        var d = Q.defer(),
            r = wfo.cfg.request,
            reqParams = {
                uri : this.weatherProvider.getApiUri(r.lang, r.name),
                proxy : this.proxy
            };

        request(reqParams, function (err, res, body) {

            if (err) {

                d.reject(err);

            } else {

                try {

                    wfo.json = JSON.parse(body);
                    d.resolve(wfo);

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



