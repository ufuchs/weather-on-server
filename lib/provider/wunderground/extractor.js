/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * extractor
 * Copyright(c) 2013-2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ It is better to be beautiful than to be good.                          ]
 * [ But... it is better to be good than to be ugly.         - Oscar Wilde -]
 */

var astro = require('../../astro.js');

(function () {

    var extractor = {},

        MAXFORECASTS = 4,

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

    //
    //
    //
    extractor.extract = function (wfo) {

        var json = wfo.json,
            fc = json.forecast.simpleforecast.forecastday,
            currObs = json.current_observation;

        wfo.weather = {

            id : wfo.cfg.request.id,

            location : wfo.cfg.request.name,

            maxForecasts : MAXFORECASTS,

            // notice midnight!
            date : currObs.local_epoch * 1000,

            forecastday : fc.map(function (forecast) {

                function getTemp(forecastday) {
                    return {
                        high : {'fahrenheit': forecastday.high.fahrenheit, 'celsius': forecastday.high.celsius},
                        low : {'fahrenheit': forecastday.low.fahrenheit, 'celsius': forecastday.low.celsius}
                    };
                }

                function createForecast(forecastday) {

                    var epoch = forecastday.date.epoch * 1000,
                        lon = currObs.observation_location.longitude,
                        lat = currObs.observation_location.latitude;

                    return {
                        epoch : epoch,
                        sun : astro.getTimesOfSun(epoch, lat, lon),
                        temp : getTemp(forecastday),
                        ic : iconMap[forecastday.icon],
                        sic : iconMap[forecastday.skyicon]
                    };

                }

                return createForecast(forecast);
            }),

            lastObservation : currObs.observation_epoch * 1000

        };

        wfo.weather.forecastday[0].ic = iconMap[currObs.icon];

        return wfo;

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `extractor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = extractor;
    }

}());
