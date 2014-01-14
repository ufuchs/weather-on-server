/*jslint node: true */
/*jslint todo: true */

// http://mathnotepad.com/
'use strict';

var suncalc = require('suncalc'),
    floor = Math.floor;

// /////////////////////////////////////////////////////////////////////////////
// GUI
// /////////////////////////////////////////////////////////////////////////////

//
//
// @api : public
function leadingZero(num) {

    var s = num.toString();
    return s.length === 2 ? s : '0' + s;

}

//
//
// @api : public
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
// @api : public
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
// @api : private
function getTimes(date, lat, lon) {

    var sun = suncalc.getTimes(new Date(date), lat, lon);

    return {
        sunrise : sun.sunrise,
        solarnoon : sun.solarNoon,
        sunset : sun.sunset,
        daylength : floor((sun.sunset - sun.sunrise) / 1000)
    };

}

//
//
// @api : public
function getTimesOfSun(date, lat, lon) {

    var times = getTimes(date, lat, lon),
        timesDayBefore = getTimes(date - 86400 * 1000, lat, lon);

    times.dld = times.daylength - timesDayBefore.daylength;

    return times;

}

module.exports = {

    leadingZero : leadingZero,
    reduce_hhmmss2hhmm : reduce_hhmmss2hhmm,

    getTimesOfSun : getTimesOfSun,
    sec2hhmmss : sec2hhmmss

};
