/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * extractor
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ It is better to be beautiful than to be good.                          ]
 * [ But... it is better to be good than to be ugly.         - Oscar Wilde -]
 */

var suncalc = require('suncalc'),
    moment = require('moment'),
    utils = require('../../astro.js');

(function () {

    var extractor,

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

    function createForecast(forecastday, lat, lon) {

        var epoch = forecastday.date.epoch * 1000;

        return {
            epoch : epoch,
            sun : utils.getTimesOfSun(epoch, lat, lon),
            temp : getTemp(forecastday),
            ic : iconMap[forecastday.icon],
            sic : iconMap[forecastday.skyicon]
        };

    }

    ////////////////////////////////////////////////////////////////////////////

    extractor = function () {};

    /**
     *
     *
     * @param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    extractor.extract = function (wfo) {

        var json = wfo.json,
            forecastday = json.forecast.simpleforecast.forecastday,
            currObs = json.current_observation,
            lon = currObs.observation_location.longitude,
            lat = currObs.observation_location.latitude,
            weather = wfo.weather,
            i;

        weather.id = wfo.cfg.request.id;
        weather.wishedDayNum = 0;

        // notice midnight!
        weather.date = currObs.local_epoch * 1000;

        weather.forecastday = [];

        for (i = 0; i < 4; i += 1) {
            weather.forecastday[i] = createForecast(forecastday[i], lat, lon);
        }

        // override day zero with the current observation
        weather.forecastday[0].ic = iconMap[currObs.icon];

        weather.lastObservation = currObs.observation_epoch * 1000;

        return wfo;

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `wundergroundExtractor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = extractor;
    }

}());
