/*jslint node: true */
/*jslint todo: true */

// http://mathnotepad.com/
'use strict';

var floor = Math.floor,
    suncalc = require('suncalc');

// /////////////////////////////////////////////////////////////////////////////
// GUI
// /////////////////////////////////////////////////////////////////////////////

//
//
//
function leadingZero(num) {

    var s = num.toString();

    return s.length === 2 ? s : '0' + s;
}

//
//
//
function reduce_hhmmss2hhmm(hhmmss) {

    return {
        hh : hhmmss.hh,
        mm : hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1),
        ss : 0
    };

}

// /////////////////////////////////////////////////////////////////////////////
// Business layer
// /////////////////////////////////////////////////////////////////////////////

//
//
//
function sec2hhmmss(sec) {

    var reminder = sec % 3600;  // remaining seconds of the uncomplete hour

    return {
        hh : floor(sec / 3600),
        mm : floor(reminder / 60),
        ss : reminder % 60
    };

}

//
//
//
function dayLenghtDiff(aDay, lat, lon) {

    var day = new Date(aDay),
        dayBefore = day - 86400 * 1000,

        sun = suncalc.getTimes(day, lat, lon),
        sunDayBefore = suncalc.getTimes(dayBefore, lat, lon),

        dld = (sun.sunset - sun.sunrise)
            - (sunDayBefore.sunset - sunDayBefore.sunrise);

    return floor(dld / 1000);

}

module.exports = {
    dayLenghtDiff : dayLenghtDiff
};
