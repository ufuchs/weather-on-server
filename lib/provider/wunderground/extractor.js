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

    function getSunByEvent(json, event) {

        var ev;

        switch (event) {

        case 'rise':
            ev = json.moon_phase.sunrise;
            break;

        case 'set':
            ev = json.moon_phase.sunset;
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

    function createForecast(forecastday) {

        return {
            date : {
                epoch : forecastday.date.epoch * 1000
            },
            temp : getTemp(forecastday),
            ic : iconMap[forecastday.icon],
            sic : iconMap[forecastday.skyicon]
        };

    }

    ////////////////////////////////////////////////////////////////////////////

    /**
     *
     *
     * @param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

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
            weather = wfo.weather,
            i;

        weather.date = currObs.local_epoch * 1000;
        weather.sun = [getSunByEvent(json, 'rise'), getSunByEvent(json, 'set')];

        weather.forecastday = [];

        for (i = 0; i < 4; i += 1) {
            weather.forecastday[i] = createForecast(forecastday[i]);
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
