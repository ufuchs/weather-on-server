/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wundergroundReq
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */
var utils = require('../utils.js'),
    cache = require('memory-cache'),
    request = require('request'),
    WeatherRequest = require('./providers').WeatherRequest;

(function (undefined) {

    var wundergroundReq,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

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
        isoCountryToProvider = {
            'de' : 'DL',
            'dk' : 'DN',
            'ru' : 'RS',
            'tr' : 'TU'
        };

    /** 
     * Maps a country code coded in `iso-3166-1` to the interrnal 
     * 'wunderground' representation.
     * Not all countries have a special 'wunderground' representation.
     *
     * @param {iso} Object
     * @return String
     *
     * @api private
     */

    function mapIsoCountryToProvider(iso) {

        var mapped = isoCountryToProvider[iso];
        return mapped === undefined ? iso.toUpperCase() : mapped;

    }

    /** 
     * Populates the `apiUri` string with a given location and the `apiKey`
     *
     * @param {location} Object
     * @return String
     *
     * @api private
     */
    function populateApiUri(location) {

        return utils.fillTemplates(apiUri, {
            apiKey : apiKey,
            language : mapIsoCountryToProvider(location.language),
            locSpec : location.name
        });

    }

    /** 
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
            fetchIt(params, cb);
            return;
        }

        cached = cache.get(location.id);

        if (cached === null) {

            fetchIt(params, function (jsonData) {

                cache.put(location.id, jsonData, cacheTTL);

                cb(jsonData);

            });


        } else {
            cb(cached);
        }

    }

    /** 
     * Sets the time to live for the cache.
     *
     * @param {ttl} Integer
     *
     * @api private
     */

    function setTTL(ttl) {

        if (ttl === undefined || ttl === null) {
            ttl = 0;
        }

        cacheTTL = ttl * 1000;
        cache.clear();
    }

    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function WundergroundReq(config) {
        proxy = config.proxy;
        apiKey = config.apiKey;
        cacheTTL = setTTL(config.ttl);
    }

    /** 
     *
     * @api private
     */

    function makeWundergroundReq(config) {
        return new WundergroundReq(config);
    }

    /** 
     * 
     * @param {proxy} String
     * @param {apiKey} String 
     * @param {ttl} Integer     
     *
     * @api public
     */

    wundergroundReq = function (proxy, apiKey, ttl) {

        return makeWundergroundReq({
            proxy : proxy,
            apiKey : apiKey,
            ttl : ttl
        });

    };

    ///////////////////////////////////////////////////////////////////////////

//    WundergroundReq.prototype = Object.create(WeatherRequest.prototype);

    WundergroundReq.prototype = {

        __proto__ : WeatherRequest.prototype,

        // submit
        get : function (location, cb) {
            get(location, function (jsonData) {
                cb(jsonData);
            });
        },


        setTTL : function (ttl) {
            setTTL(ttl);
            return this;
        }

    };

    /**
     * Expose `wundergroundReq`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wundergroundReq;
    }

}).call(this);