/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * utils
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 *   [ Whenever you find yourself on the side of the majority, it is time to ]
 *   [ pause and reflect.                                     - Oscar Wilde -]
 */

var suncalc = require('suncalc'),
    floor = Math.floor;

// /////////////////////////////////////////////////////////////////////////////
// GUI
// /////////////////////////////////////////////////////////////////////////////

//
//
// @api : public
function leadingZero(num) {
    // see http://jsperf.com/left-zero-filling for performance comparison
    var s = num + ''; // toString()
    return s.length === 2 ? s : '0' + s;

}

//
//
// @api : public
function formatDayLengthDiff(hhmmss) {
    return hhmmss.mm + ':' + leadingZero(hhmmss.ss);
}

//
//
// @api : public
function reduce_hhmmss2hhmm(hhmmss) {
    return {
        hh : hhmmss.hh,
        mm : hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1),
    };
}

//
//
// @api : public
function reduce_hhmmss2hhmmEx(hhmmss) {
    return {
        hh : leadingZero(hhmmss.hh),
        mm : leadingZero(hhmmss.mm + (hhmmss.ss < 30 ? 0 : 1)),
    };
}

// /////////////////////////////////////////////////////////////////////////////
// Business layer
// /////////////////////////////////////////////////////////////////////////////

// http://mathnotepad.com/

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
//
function dateTime2hhmmss(date) {
    return {
        hh : date.getHours(),
        mm : date.getMinutes(),
        ss : date.getSeconds()
    };
}

//
//
// @api : private
function getTimes(date, lat, lon) {

    var sun = suncalc.getTimes(new Date(date), lat, lon);

    return {
        sunrise : reduce_hhmmss2hhmmEx(dateTime2hhmmss(sun.sunrise)),
        solarnoon : reduce_hhmmss2hhmmEx(dateTime2hhmmss(sun.solarNoon)),
        sunset : reduce_hhmmss2hhmmEx(dateTime2hhmmss(sun.sunset)),
        daylength : sun.sunset.valueOf() - sun.sunrise.valueOf()
    };

}

//
//
// @api : public
function getTimesOfSun(date, lat, lon) {

    var times = getTimes(date, lat, lon),
        timesDayBefore = getTimes(date - 86400 * 1000, lat, lon);

    times.dld = sec2hhmmss(floor((times.daylength
        - timesDayBefore.daylength) / 1000));

    // ! keep the code line on this position !
    // 'dld' should calced before.
    times.daylength = sec2hhmmss(floor(times.daylength / 1000));

    return times;

}

module.exports = {

    leadingZero : leadingZero,
    reduce_hhmmss2hhmm : reduce_hhmmss2hhmm,
    reduce_hhmmss2hhmmEx : reduce_hhmmss2hhmmEx,
    formatDayLengthDiff : formatDayLengthDiff,

    getTimesOfSun : getTimesOfSun,
    sec2hhmmss : sec2hhmmss

};
