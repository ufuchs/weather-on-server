/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * filenames
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */
var utils = require('../utils.js');

(function (undefined) {

    var wunderground,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

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

    // Extracts the temperature of the given `forecastday` and map it into a 
    // API compatible Object.
    //
    // @param {forecastday} Object
    // @return Object
    // @api private

    function getTemp(forecastday) {

        var high = forecastday.high,
            low = forecastday.low;

        return {
            high : {'fahrenheit': high.fahrenheit, 'celsius': high.celsius},
            low : {'fahrenheit': low.fahrenheit, 'celsius': low.celsius}
        };
    }

    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function Wunderground(config) {

        return null;

    }

    /** 
     *
     * @api private
     */

    function makeWunderground(config) {
        return new Wunderground(config);
    }

    /** 
     * Provides the filenames for a given device and language.
     *
     * @ param {cfg} Object - comes from `app-config.js`
     * @ param {device} String 
     * @ param {lang} String 
     *
     * @api public
     */

    wunderground = function (cfg) {

        return makeWunderground({
            cfg : cfg
        });

    };

    ///////////////////////////////////////////////////////////////////////////

    Wunderground.prototype = {

        //
        //
        //
        extractWeatherFromProviderData : function (aWeather, callback) {

            var
                weather = aWeather,
                forecastday = weather.forecast.simpleforecast.forecastday,
                currObs = weather.current_observation,

                sun,

                // all values in seconds
                yesterdaysSun = {
                    rise: 23220,
                    set: 71840,
                    dayLenght: 48600,
                    dayLenghtDiff: 0
                };

            astroProvider.update(weather);

            sun = astroProvider.sun(yesterdaysSun);

            callback({

                countryISO : currObs.display_location.country_iso3166,

                date : currObs.local_epoch * 1000,

                sr : sun.rise,
                ss : sun.set,
                dl : sun.dayLenght,
                dld : sun.dayLenghtDiff,

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

            });

        }

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wunderground;
    }

}).call(this);