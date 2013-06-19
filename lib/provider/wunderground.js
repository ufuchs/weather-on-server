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
    moment = require('moment'),
    request = require('request');

(function (undefined) {

    var wunderground,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        VERSION = "0.1.0",

        apiKey,

        proxy,

        cacheTTL = 0,

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

        var mapped = isoCountryToWunderground[iso];
        return mapped === undefined ? iso.toUpperCase() : mapped;

    }

    /**
     * Populates the `apiUri` string with a given `location` and the `apiKey`
     *
     * @param {location} Object
     * @return String
     *
     * @api private
     */

    function populateApiUri(location) {

        return utils.fillTemplates(apiUri, {
            apiKey : apiKey,
            language : mapIsoCountryToWunderground(location.language),
            locSpec : location.name
        });

    }

    /**
     * @copyright Vincent Schoettke
     *
     * Submits the request to 'Wunderground'
     *
     * @param {params} Object
     * @params {cb} Function
     *
     * @api private
     */

    function doFetchIt(params, cb) {

        request(params, function (err, res, body) {

            if (err) {
                cb(err, null);
            }

            try {
                var jsonData = JSON.parse(body);
                cb(null, jsonData);
            } catch (jsonError) {
                cb(jsonError, null);
            }

        });

    }

    /**
     * Wraps the true submit
     *
     * @param {params} Object
     * @params {cb} Function
     *
     * @api private
     */

    function fetchIt(params, cb) {

        doFetchIt(params, function (err, jsonData) {

            if (err) {
                console.log("Error while downloading weather data\n" + err);
                throw err;
            }

            cb(jsonData);

        });

    }

    /**
     * Submits a request and fetchs the response, the wather data.
     *
     * @param {location} Object
     * @params {cb} Function
     *
     * @api private
     */

    function get(location, cb) {

        var cached,
            params = {
                uri : populateApiUri(location),
                proxy : proxy
            };

        if (cacheTTL === 0) {
            console.log('uncached');
            fetchIt(params, cb);
            return;
        }

        // TODO : handle first request after midnight if cache is still valid
        // Simple approach, doesn't handle timezones yet.
        if (moment().hour() === 23) {
            cache.del(location.id);
        }

        cached = cache.get(location.id);

        if (cached === null) {

            console.log('cache missing');

            fetchIt(params, function (jsonData) {

                cache.put(location.id, jsonData, cacheTTL);

                cb(jsonData);

            });


        } else {
            console.log('cache hit');
            cb(cached);
        }

    }

    ///////////////////////////////////////////////////////////////////////////

    function Wunderground(config) {
        proxy = config.proxy;
        apiKey = config.apiKey;
        cacheTTL = config.ttl * 1000 || 0;
    }

    /**
     *
     * @param {proxy} String
     * @param {apiKey} String
     * @param {ttl} Integer
     *
     * @api public
     */

    wunderground = function (proxy, apiKey, ttl) {

        return new Wunderground({
            proxy : proxy,
            apiKey : apiKey,
            ttl : ttl
        });

    };

    ///////////////////////////////////////////////////////////////////////////

    wunderground.fn = Wunderground.prototype = {};

    wunderground.extractWeather = function (weatherAsJson, callback) {

        var forecastday = weatherAsJson.forecast.simpleforecast.forecastday,
            currObs = weatherAsJson.current_observation,

            // all values in seconds
            yesterdaysSun = {
                rise: 23220,
                set: 71840,
                dayLenght: 48600,
                dayLenghtDiff: 0
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

        function getTemp(forecastday) {
            var high = forecastday.high,
                low = forecastday.low;
            return {
                high : {'fahrenheit': high.fahrenheit, 'celsius': high.celsius},
                low : {'fahrenheit': low.fahrenheit, 'celsius': low.celsius}
            };
        }

        function getSunByEvent(event) {

            var ev,
                hour,
                min;

            switch (event) {

            case 'rise':
                ev = weatherAsJson.moon_phase.sunrise;
                break;

            case 'set':
                ev = weatherAsJson.moon_phase.sunset;
                break;

            }

            hour = ev.hour;
            min = ev.minute;

            return hour * 3600 + min * 60;

        }

        function getSun(yesterdaysSun) {

            var rise = getSunByEvent('rise'),
                set = getSunByEvent('set'),
                dayLength = set - rise,
                dayLengthDiff;

            if (yesterdaysSun === null || yesterdaysSun === undefined) {
                dayLengthDiff = 0;
            } else {
                dayLengthDiff = dayLength - yesterdaysSun.dayLength;
            }

            return {
                rise : rise,
                set : set,
                dayLength : dayLength,
                dayLengthDiff : dayLengthDiff
            };

        }

        callback({

            countryISO : currObs.display_location.country_iso3166,

            date : currObs.local_epoch * 1000,

            sun : getSun(null),
            // today
            temp0 : getTemp(forecastday[0]),
            ic0 : iconMap[forecastday[0].icon],
            sic0 : iconMap[forecastday[0].skyicon],

            // tommorow
            temp1 : getTemp(forecastday[1]),
            ic1 : iconMap[forecastday[1].icon],
            sic1 : iconMap[forecastday[1].skyicon],

            // day after tommorow
            dow2 : forecastday[2].date.weekday,
            temp2 : getTemp(forecastday[2]),
            ic2 : iconMap[forecastday[2].icon],
            sic2 : iconMap[forecastday[2].skyicon],

            // day after tommorow + 1
            dow3 : forecastday[3].date.weekday,
            temp3 : getTemp(forecastday[3]),
            ic3 : iconMap[forecastday[3].icon],
            sic3 : iconMap[forecastday[3].skyicon],

            lastObservation : currObs.observation_epoch * 1000

        });

    };

    //
    //
    //
    wunderground.getWeather = function (location, cb) {

        get(location, function (jsondata) {

            wunderground.extractWeather(jsondata, function (weather) {
                cb(weather);
            });

        });

    }

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wunderground;
    }

}).call(this);
