/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * wunderground
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

var astro = require('../astro.js'),
    utils = require('../utils.js');

(function () {

    'use strict';

    var wunderground,

        MAXFORECASTS = 4;

    /************************************
        Extractor
    ************************************/

    function Extractor() {

        this.iconMap = {
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

        this.createForecast = function (forecastday, currObs) {

            var epoch = forecastday.date.epoch * 1000,
                lon = currObs.observation_location.longitude,
                lat = currObs.observation_location.latitude;

            function getTemp(fc) {
                return {
                    high : {'fahrenheit': fc.high.fahrenheit, 'celsius': fc.high.celsius},
                    low : {'fahrenheit': fc.low.fahrenheit, 'celsius': fc.low.celsius}
                };
            }

            return {
                epoch : epoch,
                sun : astro.getTimesOfSun(epoch, lat, lon),
                temp : getTemp(forecastday),
                ic : this.iconMap[forecastday.icon],
                sic : this.iconMap[forecastday.skyicon]
            };

        };

    }

    Extractor.prototype = {

        extract : function (wfo) {

            var json = wfo.json,
                fc = json.forecast.simpleforecast.forecastday,
                currObs = json.current_observation,
                that = this;

            wfo.weather = {

                id : wfo.cfg.request.id,

                location : wfo.cfg.request.name,

                maxForecasts : MAXFORECASTS,

                // display

                // notice midnight!
                date : currObs.local_epoch * 1000,

                forecastday : fc.map(function (forecast) {
                    return that.createForecast(forecast, currObs);
                }),

                lastObservation : currObs.observation_epoch * 1000

                // /display

            };

            wfo.weather.forecastday[0].ic = that.iconMap[currObs.icon];

            return wfo;

        }

    };

    /************************************
        Query
    ************************************/

    function Query() {

        this.apiKey = process.env.WUNDERGROUND_KEY;

        this.apiUri = 'http://api.wunderground.com/api/'
            + '{{apiKey}}'
            + '/astronomy/conditions/forecast'
            + '/lang:{{language}}'
            + '/q'
            + '/{{location}}.json';

        // @see in : http://www.iso.org/iso/home/standards/country_codes/iso-3166-1_decoding_table.htm
        // @see out : http://www.wunderground.com/weather/api/d/docs?d=resources/country-to-iso-matching
        this.isoCountry2Provider = {
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

        this.mapIsoCountry2Provider = function (iso) {
            var mapped = this.isoCountry2Provider[iso];
            return mapped === undefined ? iso.toUpperCase() : mapped;
        };

    }

    Query.prototype = {

        getApiUri : function (lang, location) {
            return utils.fillTemplates(this.apiUri, {
                apiKey : this.apiKey,
                language : this.mapIsoCountry2Provider(lang),
                location : location
            });
        }

    };

    /************************************
        Wunderground
    ************************************/

    function Wunderground() {
        this.query = new Query();
        this.extractor = new Extractor();
    }

    Wunderground.prototype = {

        getApiUri : function (lang, location) {
            return this.query.getApiUri(lang, location);
        },

        extract : function (wfo) {
            return this.extractor.extract(wfo);
        }
    };

    wunderground = function () {
        return new Wunderground();
    };

    /**
     * Expose `wunderground`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = wunderground;
    }

}());
