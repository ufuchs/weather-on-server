/*jslint node: true */
/*jslint todo: true */

'use strict';

var utils = require('../utils.js'),
    astroProvider,
    
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

    function update(aWeather) {
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
        update : update,
        sun : getSun
    };

}());

// Extracts the temperature of the given `forecastday` and map it into a 
// API compatible Object.
//
// @param {forecastday} Object
// @return Object
//
function getTemp(forecastday) {

    var high = forecastday.high,
        low = forecastday.low;

    return {
        high : {'fahrenheit': high.fahrenheit, 'celsius': high.celsius},
        low : {'fahrenheit': low.fahrenheit, 'celsius': low.celsius}
    };
}

//
// @param {icon} String
// @return String
//
function mapIcon(icon) {

    return iconMap[icon];
}

//
//
//
exports.extractWeatherFromProviderData = function (aWeather, callback) {

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
        ic0 : mapIcon([forecastday[0].icon]),
        sic0 : mapIcon([forecastday[0].skyicon]),

        // tommorow
        temp1 : getTemp(forecastday[1]),
        ic1 : mapIcon([forecastday[1].icon]),
        sic1 : mapIcon([forecastday[1].skyicon]),

        // day after tommorow
        dow2 : forecastday[2].date.weekday,
        temp2 : getTemp(forecastday[2]),
        ic2 : mapIcon([forecastday[2].icon]),
        sic2 : mapIcon([forecastday[2].skyicon]),

        // day after tommorow + 1
        dow3 : forecastday[3].date.weekday,
        temp3 : getTemp(forecastday[3]),
        ic3 : mapIcon([forecastday[3].icon]),
        sic3 : mapIcon([forecastday[3].skyicon]),

        lastObservation : currObs.observation_epoch * 1000

    });

};
