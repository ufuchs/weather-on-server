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
    moment = require('moment');

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

    function roundToHHmm(time) {

        var ss2min = time.seconds() < 30 ? 0 : 1,
            min = (time.minutes() + ss2min).toString(),
            hour = time.hours().toString();

        if (hour.length === 1) {
            hour = '0' + hour;
        }

        if (min.length === 1) {
            min = '0' + min;
        }

        return hour.toString() + min.toString();

    }

    extractor = function () {

        var sun = suncalc.getTimes(new Date(), 52.52, 13.38),
            sr = moment(sun.sunrise),
            ss = moment(sun.sunset);

        console.log('sr', sr);
        console.log('sr', sr.valueOf());

        ss = moment(sr.valueOf());

//        console.log('sr', roundToHHmm(sr));
        /*
        console.log('sr', sr.seconds());
        console.log('sr', sr.minutes());
        console.log('sr', sr.hours());
        */

        console.log('ss', ss.format('HH:mm:ss'));
        console.log('ss', roundToHHmm(ss));
    };

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
            i,
            sc;

        weather.id = wfo.cfg.request.id;
        weather.wishedDayNum = 0;

        weather.date = currObs.local_epoch * 1000;

        sc = suncalc.getTimes(new Date(weather.date), currObs.observation_location.latitude, currObs.observation_location.longitude);

        weather.sun = [moment(sc.sunrise).valueOf(), moment(sc.sunset).valueOf()];

        console.log(sc.sunrise);
        console.log(sc.sunset);

        console.log(weather.sun);

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
