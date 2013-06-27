/*jslint node: true */
/*jslint todo: true */

/*!
 * utils
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person reveals his character by nothing so clearly as the joke ]
 * [ he resents..                            - Georg C. Lichtenberg - ]
 */

'use strict';

var moment = require('moment'),
    path = require('path');

// Splits the `sec` into a `hour` and a `minute` part
//
// @param {sec} Integer
// @return {hour, minute} Object
var sec2HhMm = function (sec) {

    var hour = String(Math.floor(sec / 3600)),
        min = String(Math.floor((sec % 3600) / 60));

    if (hour.length === 1) {
        hour = '0' + hour;
    }

    if (min.length === 1) {
        min = '0' + min;
    }

    return {
        hour : hour,
        min : min
    };

};

//
//
//
var hhMm2Sec = function (hhMm) {
    return hhMm.hour * 3600 + hhMm.min * 60;
};

//
//
//
var splitHhMm = function (hhMm) {
    return {
        hour : hhMm.substr(0, 2),
        min : hhMm.substr(2, 3)
    };
};

//
//
//
var adjustDST = function (sun) {

    if (moment().isDST()) {

        sun.sr.hour = parseInt(sun.sr.hour, 10) + 1;
        sun.ss.hour = parseInt(sun.ss.hour, 10) + 1;

        if (sun.sr.hour.toString().length === 1) {
            sun.sr.hour = '0' + sun.sr.hour;
        }

    }

    return sun;

};

//
//
//
var sunObj = function (value) {

    var sr = 0,
        ss = 0,
        dl = 0;

    if (value !== null) {

        sr = splitHhMm(value[0]);
        ss = splitHhMm(value[1]);
        dl = sec2HhMm(hhMm2Sec(ss) - hhMm2Sec(sr));

    }

    return {
        sr : sr,
        ss : ss,
        dl : dl,
        dld : ''
    };

};

//
//
//
var getSun = function (today, yesterday, byTable) {

    var sunToday = sunObj(today),
        sunYesterday = sunObj(yesterday),
        dld = '';

    if (yesterday !== null) {

        dld = String((hhMm2Sec(sunYesterday.dl) - hhMm2Sec(sunToday.dl)) / 60);
        if (dld.length === 1) {
            dld = dld === '0' ? '±' + dld : '+' + dld;
        }

    }

    sunToday.dld = dld;

    if (byTable) {
        sunToday =  adjustDST(sunToday);
    }

    return sunToday;

};

exports.getSun = getSun;

//
//
//
exports.getSunFilename = function (id) {

    var localesPool = './locales/';

    return path.resolve(localesPool
        + id
        + '-'
        + moment().year()
        + '-sun.txt');

};
