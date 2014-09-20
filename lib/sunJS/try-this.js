/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var suncalc = require('./suncalc.js'),
    julian = require('./meeus/julian.js'),
    Q = require('q'),

//    d = new Date(),
    d = new Date(2014, 7 - 1, 1),
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

    days.map(function (p) {
        console.log('date',p.date);
        console.log('jd  ', p.jd);
        console.log('rise', sec2hhmmss(p.rise));
        console.log('none', sec2hhmmss(p.transit));
        console.log('set ', sec2hhmmss(p.set));
        console.log('dl  ', sec2hhmmss(p.daylength));
        console.log('dld ', sec2hhmmss(p.daylengthDiff));
//      console.log('equi', p.zeroDelta);
//      console.log('sols', p.minMaxDelta);
        console.log('sols', p.minMaxMRadVec);

    });

}).fail(function (err) {
    console.log(err);
});

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
