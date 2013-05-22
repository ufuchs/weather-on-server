/*jslint node: true */
/*jslint todo: true */

'use strict';

//
//
//
exports.provider = (function () {

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


