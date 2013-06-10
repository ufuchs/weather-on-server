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
    request = require('request');

(function (undefined) {

    var wundergroundReq,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        apiKey,

        proxy,

        cacheTTL = 0,

        apiUri = 'http://api.wunderground.com/api/'
            + '{{apiKey}}'
            + '/astronomy/conditions/forecast'
            + '/lang:{{language}}'
            + '/q'
            + '/{{locSpec}}.json',

        // in : http://www.iso.org/iso/home/standards/country_codes/iso-3166-1_decoding_table.htm
        // out : http://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
        isoCountryToProvider = {
            'de' : 'DL',
            'dk' : 'DN',
            'ru' : 'RS',
            'tr' : 'TU'
        };


    //
    //
    //
    function mapIsoCountryToProvider(iso) {

        var mapped = isoCountryToProvider[iso];
        return mapped === undefined ? iso.toUpperCase() : mapped;

    }

    //
    //
    //
    function populateApiUri(loc) {

        return utils.fillTemplates(apiUri, {
            apiKey : apiKey,
            language : mapIsoCountryToProvider(loc.language),
            locSpec : loc.name
        });

    }

    //
    //
    //
    function requestParams(location) {

        return {
            uri : populateApiUri(location),
            proxy : proxy
        };

    }

    //
    //
    //
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

    //
    //
    //
    function fetchIt(location, cb) {

        var params = requestParams(location);

        doFetchIt(params, function (err, jsonData) {

            if (err) {
                console.log("Error while downloading weather data\n" + err);
                throw err;
            }

            cb(jsonData);

        });


    }

    //
    //
    //
    function setTTL(ttl) {

        if (ttl === undefined || ttl === null) {
            ttl = 0;
        }

        cacheTTL = ttl * 1000;
        cache.clear();
    }

    //
    //
    //
    function get(location, cb) {

        var cached;

        if (cacheTTL === 0) {
            fetchIt(location, cb);
            return;
        }

        cached = cache.get(location.id);

        if (cached === null) {

            fetchIt(location, function (jsonData) {

                cache.put(location.id, jsonData, cacheTTL);

            console.log(jsonData);

                cb(jsonData);

            });

        } else {
            cb(cached);
        }

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
     *
     * @ param {apiKey} String 
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

    WundergroundReq.prototype = {

        serviceUrl : function (loc) {
            return populateApiUri(loc);
        },

        get : function (location, ttl, cb) {
            get(location, function (jsonData) {
                cb(jsonData);
            });
        },

        setTTL : function (ttl) {
            setTTL(ttl);
            return this;
        }

        fetchIt : HIER WEITER

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wundergroundReq;
    }

}).call(this);