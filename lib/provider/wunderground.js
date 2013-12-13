/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wunderground
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Insanity: doing the same thing over and over again and expecting ]
 * [ different results.                           - Albert Einstein - ]
 */

/**
 * Dependencies
 */
var utils = require('../utils.js'),
    cache = require('memory-cache'),
    request = require('request'),
    cfg = require('../../weather-config.js'),
    when = require('when'),
    nodefn = require("when/node/function"),
    demoWeather = require('./2013-03-29.json');

/*

var rendererPrototype = {

    render : function (device, out) {
        return this[device].render(out);
    },

    init : function () {
        console.log('init');
    }

};

*/

/**
 * Manages the use of a device renderer by a given `device' per prototype
 *
 * @api public
 */

/*
function renderer() {

    function F() {};
    F.prototype = rendererPrototype;

    var f = new F();

    f.init();
    return f;

}
*/

(function () {

    var wunderground,

        useTestData = false,

        VERSION = "0.4.0",

        apiKey,

        proxy,

        // @see http://www.wunderground.com/weather/api/d/docs?d=data/index
        apiUri = 'http://api.wunderground.com/api/'
            + '{{apiKey}}'
            + '/astronomy/conditions/forecast'
            + '/lang:{{language}}'
            + '/q'
            + '/{{locSpec}}.json',

        // @see in : http://www.iso.org/iso/home/standards/country_codes/iso-3166-1_decoding_table.htm
        // @see out : http://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
        isoCountryToWunderground = {
            'de' : 'DL',
            'dk' : 'DN',
            'ru' : 'RS',
            'tr' : 'TU'
        },

        iconMap = {
            chanceflurries: 'sn',
            chancesnow: 'sn',
            snow: 'sn',
            chancerain: 'ra',
            rain: 'ra',
            chancesleet: 'rasn',
            sleet: 'rasn',
            mostlysunny: 'few',
            partlycloudy: 'sct',
            partlysunny: 'bkn',
            mostlycloudy: 'bkn',
            cloudy: 'ovc',
            clear: 'skc',
            sunny: 'skc',
            chancetstorms: 'tsra',
            tstorms: 'tsra',
            fog: 'fg',
            hazy: 'mist'
        };

    /**
     * Maps a country code coded in `iso-3166-1` to the internal
     * 'wunderground' representation.
     * Not /all/ countries have a special 'wunderground' representation.
     *
     * @param {iso} Object
     * @return String
     *
     * @api private
     */

    function mapIsoCountryToWunderground(iso) {

        var mapped = isoCountryToWunderground[iso]; // || iso.toUpperCase();
        return mapped === undefined ? iso.toUpperCase() : mapped;

    }

    /**
     * paritial Copyright(c) Vincent Schoettke
     *
     * Submits a request and fetchs the response, the weather data.
     *
     * @param {params} data object
     * @return data object
     *
     * @api private
     */

    function requestDataFromWeatherProvider(params, cb) {

        var reqParams = {
                uri : utils.fillTemplates(apiUri, {
                    // Populate the `apiUri` string with a given `location` and the `apiKey`
                    apiKey : apiKey,
                    language : mapIsoCountryToWunderground(params.location.lang),
                    locSpec : params.location.name
                }),
                proxy : proxy
            };

        if (useTestData) {
            params.json = demoWeather;
            cb(null, params);
        }

        request(reqParams, function (err, res, body) {

            if (err) {
                params.json = null;
                cb(err, params);
                return;
            }

            try {
                params.json = JSON.parse(body);
                cb(null, params);
            } catch (jsonError) {
                params.json = null;
                cb(jsonError, params);
            }
        });

    }

    /**
     * Wrapper for the 'fetchIt' function.
     *
     * @param {location} Object
     * @params {cb} Function
     *
     * @api private
     */

    function fetchIt_Cached(location, cb) {

        var cached = cache.get(location.id);

        if (cached === null) {

            fetchIt(location, function (err, jsonData) {

                if (err) {
                    cb(err, null);
                    return;
                }

                cache.put(location.id, jsonData, cfg.production.expires * 1000);

                cb(null, jsonData);

            });


        } else {
            cb(null, cached);
        }

    }

    //
    //
    //
    function extractWeather(params) {

        var weatherAsJson = params.json,
            forecastday = weatherAsJson.forecast.simpleforecast.forecastday,
            currObs = weatherAsJson.current_observation,
            weather = params.weather,
            i;

        function getTemp(forecastday) {
            var high = forecastday.high,
                low = forecastday.low;
            return {
                high : {'fahrenheit': high.fahrenheit, 'celsius': high.celsius},
                low : {'fahrenheit': low.fahrenheit, 'celsius': low.celsius}
            };
        }

        function getSunByEvent(event) {

            var ev;

            switch (event) {

            case 'rise':
                ev = weatherAsJson.moon_phase.sunrise;
                break;

            case 'set':
                ev = weatherAsJson.moon_phase.sunset;
                break;

            }

            if (ev.hour.length === 1) {
                ev.hour = '0' + ev.hour;
            }

            if (ev.minute.length === 1) {
                ev.minute = '0' + ev.minute;
            }

            return ev.hour + ev.minute;

        }

        weather.date = currObs.local_epoch * 1000;
        weather.sun = [getSunByEvent('rise'), getSunByEvent('set')];

        weather.forecastday = [];

        for (i = 0; i < 4; i += 1) {
            weather.forecastday[i] = {
                date : {
                    epoch : forecastday[i].date.epoch * 1000
                },
                temp : getTemp(forecastday[i]),
                ic : iconMap[forecastday[i].icon],
                sic : iconMap[forecastday[i].skyicon]
            };

        }

        weather.lastObservation = currObs.observation_epoch * 1000;

        return params;

    }

    //
    //
    //
    function finalizeStage(params) {
        delete params.json;
        return params;
    }


    ///////////////////////////////////////////////////////////////////////////

    /**
     *
     * @param {proxy} String
     * @param {apiKey} String
     *
     * @api public
     */

    wunderground = function (aProxy, aApiKey) {

        proxy = aProxy;
        apiKey = aApiKey;

    };

    /**
     *
     * @param {params} data object
     * @return data object
     *
     * @api public
     */

    wunderground.getWeather = function (params, cb) {

        when(nodefn.call(requestDataFromWeatherProvider, params))
            .then(extractWeather)
            .then(finalizeStage)
            .then(function (params) {
                cb(null, params);
            });

    };

    /**
     *
     * @param {enable} int
     *
     * @api public
     */

    wunderground.useTestData = function (enable) {
        useTestData = enable;
    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `wunderground`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = wunderground;
    }

}());
