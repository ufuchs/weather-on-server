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
    request = require('request');

(function (undefined) {

    var wundergroundReq,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        apiKey,

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

        console.log(loc);

        return utils.fillTemplates(apiUri, {
            apiKey : apiKey,
            language : mapIsoCountryToProvider(loc.language),
            locSpec : loc.name
        });

    }

    //
    //
    //
    function getRequestParams(location) {

        return {
            uri : populateApiUri(location),
            proxy : process.env.HTTP_PROXY
        };

    }

    //
    //
    //
    function downloadDataFromProvider(params, callback) {

        request(params, function (err, res, body) {

            if (err) {
                callback(err, null);
            }

            try {
                var jsonData = JSON.parse(body);
                callback(null, jsonData);
            } catch (jsonError) {
                callback(jsonError, null);
            }

        });

    }

    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function WundergroundReq(config) {
        apiKey = config.apiKey;
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

    wundergroundReq = function (apiKey) {

        return makeWundergroundReq({
            apiKey : apiKey
        });

    };

    ///////////////////////////////////////////////////////////////////////////

    WundergroundReq.prototype = {

        get : function (location, callback) {
            downloadDataFromProvider(location, callback);
        },

        serviceUrl : function (loc) {
            return populateApiUri(loc);
        }

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wundergroundReq;
    }

}).call(this);