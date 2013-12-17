/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wundergroundQuery
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 */

var utils = require('./../utils.js');

(function () {

    var wunderground,

        apiKey,

        apiUri = 'http://api.wunderground.com/api/'
            + '{{apiKey}}'
            + '/astronomy/conditions/forecast'
            + '/lang:{{language}}'
            + '/q'
            + '/{{location}}.json',

        // @see in : http://www.iso.org/iso/home/standards/country_codes/iso-3166-1_decoding_table.htm
        // @see out : http://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
        isoCountry2Provider = {
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

    function mapIsoCountry2Provider(iso) {

        var mapped = isoCountry2Provider[iso]; // || iso.toUpperCase();
        return mapped === undefined ? iso.toUpperCase() : mapped;

    }

    ////////////////////////////////////////////////////////////////////////////

    //
    //
    //
    wunderground = function (aApiKey) {
        apiKey = aApiKey;
    };

    //
    //
    //
    wunderground.getApiUri = function (lang, location) {

        return utils.fillTemplates(apiUri, {
            apiKey : apiKey,
            language : mapIsoCountry2Provider(lang),
            location : location
        });

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `wunderground`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = wunderground;
    }

}());
