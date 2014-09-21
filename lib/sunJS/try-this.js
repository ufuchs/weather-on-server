/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var suncalc = require('./suncalc.js'),
    julian = require('./meeus/julian.js'),
    Q = require('q'),

    d = new Date(),
//    d = new Date(2014, 7 - 1, 1),
//    d = new Date(2014, 1 - 1, 1, 5, 0, 0),

    lon = 13.4105,
    lat = 51.5243;


// Splits a number of seconds into hour, minute, seconds
// @param {num} Integer - number of seconds
// @return Object - A sign plus hours, minutes, seconds
// @api : private
function sec2hhmmss(sec) {

    var reminder = Math.abs(sec) % 3600;  // remaining seconds of the uncomplete hour

    return {
        sign : sec >= 0 ? 1 : -1,
        hh : Math.floor(Math.abs(sec) / 3600),
        mm : Math.floor(reminder / 60),
        ss : reminder % 60
    };

}

Q.when(suncalc.getTimes(d, lat, lon)).then(function (days) {

    var i;

    for (i = 0; i < days.length; i +=1) {

        var day = days[i];

        console.log('date',day.date);
        console.log('jd  ', day.jd);
        console.log('rise', sec2hhmmss(day.rise));
        console.log('none', sec2hhmmss(day.transit));
        console.log('set ', sec2hhmmss(day.set));
        console.log('dl  ', sec2hhmmss(day.daylength));
        console.log('dld ', sec2hhmmss(day.daylengthDiff));
        console.log('equi', day.zeroDelta);
//      console.log('sols', day.minMaxDelta);
//      console.log('sols', day.minMaxMRadVec);

    }

}).fail(function (err) {
    console.log(err);
});

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
