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

// TODO : handle first request after midnight if cache is still valid

/**
 * Dependencies
 */
var utils = require('../utils.js'),
    cache = require('memory-cache'),
    moment = require('moment'),
    astro = require('./../astronomy/astro.js'),
    request = require('request');

(function (undefined) {

    var wunderground,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        VERSION = "0.1.0",

        location,

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
            language : mapIsoCountryToWunderground(location.lang),
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

    function fetchIt(params, cb) {

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
     * Submits a request and fetchs the response, the wather data.
     *
     * @param {location} Object
     * @params {cb} Function
     *
     * @api private
     */

    function get(theLocation, cb) {

        var cached,
            params = {
                uri : populateApiUri(location = theLocation),
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

        if ((cached = cache.get(location.id)) === null) {

            console.log('cache missing');

            fetchIt(params, function (err, jsonData) {

                if (err) {
                    throw err;
                }

                cache.put(location.id, jsonData, cacheTTL);

                cb(jsonData);

            });


        } else {
            console.log('cache hit');
            cb(cached);
        }

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     *
     * @param {proxy} String
     * @param {apiKey} String
     * @param {ttl} Integer
     *
     * @api public
     */

    wunderground = function (aProxy, aApiKey, aTtl) {

        proxy = aProxy;
        apiKey = aApiKey;
        cacheTTL = aTtl * 1000 || 0;

    };

    ///////////////////////////////////////////////////////////////////////////

    wunderground.extractWeather = function (weatherAsJson, cb) {

        var forecastday = weatherAsJson.forecast.simpleforecast.forecastday,
            currObs = weatherAsJson.current_observation,
            weather,
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

        //
        //
        //
        function getSunParams() {

            return {
                id : location.id,
                sunToday : [ getSunByEvent('rise'), getSunByEvent('set')],
                doy : moment(currObs.local_epoch * 1000).dayOfYear()
            };

        }

        astro.getSun(getSunParams(), function (err, sunRStoday) {

            weather = {

                countryISO : currObs.display_location.country_iso3166,

                date : currObs.local_epoch * 1000,

                sun : sunRStoday,

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

            };

            cb(weather);

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
