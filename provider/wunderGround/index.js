/*jslint node: true */
/*jslint todo: true */

'use strict';

var utils = require('../../lib/utils.js'),
    astroProvider;// = require('../../astronomy/index.js').provider;

//
//
//
exports.serviceUrl = (function () {

    var url_template = 'http://api.wunderground.com/api/{{apikey}}/astronomy/conditions/forecast/lang:{{language}}/q/{{locSpec}}.json';

    function populateWith(loc) {

        return utils.fillTemplates(url_template, {
            apikey: process.env.WONDERGROUND_KEY,
            language: loc.language,
            locSpec: loc.name
        });

    }

    return {
        populateWith : populateWith
    };

}());

//
//
//
astroProvider = (function () {

    var weather;

    function init(aWeather) {
        weather = aWeather;
    }


    function getSunByEvent(event) {

        var ev,
            hour,
            min;

        switch (event) {

        case 'rise':
            ev = weather.moon_phase.sunrise;
            break;

        case 'set':
            ev = weather.moon_phase.sunset;
            break;

        }

        hour = ev.hour;
        min = ev.minute;

        return hour * 3600 + min * 60;

    }

    function getSun(yesterdaysSun) {

        var rise = getSunByEvent('rise'),
            set = getSunByEvent('set'),
            dayLenght = set - rise,
            dayLenghtDiff;

        if (yesterdaysSun === null || yesterdaysSun === undefined) {
            dayLenghtDiff = 0;
        } else {
            dayLenghtDiff = dayLenght - yesterdaysSun.dayLenght;
        }

        return {
            rise : rise,
            set : set,
            dayLenght : dayLenght,
            dayLenghtDiff : dayLenghtDiff
        };
    }

    return {
        init : init,
        sun : getSun
    };

}());

//
//
//
exports.extractWeatherFromProviderData = function (aWeather, callback) {

    var
        weather = aWeather,
        forecastday = weather.forecast.simpleforecast.forecastday,
        sun,
        map = {

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

        },

        // all values in seconds
        yesterdaysSun = {
            rise: 23220,
            set: 71840,
            dayLenght: 48600,
            dayLenghtDiff: 0
        };

    astroProvider.init(weather);

    sun = astroProvider.sun(yesterdaysSun);

    callback({

        date : weather.current_observation.local_epoch * 1000,

        sr : sun.rise,
        ss : sun.set,
        dl : sun.dayLenght,
        dld : sun.dayLenghtDiff,

        // today
        h0 : forecastday[0].high.celsius,
        l0 : forecastday[0].low.celsius,
        ic0 : map[forecastday[0].icon],
        sic0 : map[forecastday[0].skyicon],

        // tommorow
        h1 : forecastday[1].high.celsius,
        l1 : forecastday[1].low.celsius,
        ic1 : map[forecastday[1].icon],
        sic1 : map[forecastday[1].skyicon],

        // day after tommorow
        dow2 : forecastday[2].date.weekday,
        h2 : forecastday[2].high.celsius,
        l2 : forecastday[2].low.celsius,
        ic2 : map[forecastday[2].icon],
        sic2 : map[forecastday[2].skyicon],

        // // day after tommorow + 1
        dow3 : forecastday[3].date.weekday,
        h3 : forecastday[3].high.celsius,
        l3 : forecastday[3].low.celsius,
        ic3 : map[forecastday[3].icon],
        sic3 : map[forecastday[3].skyicon],

        lastObservation : weather.current_observation.observation_epoch * 1000

    });

};
