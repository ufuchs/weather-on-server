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

exports.sec2HhMm = sec2HhMm;

//
//
//
var hhMm2Sec = function (hhMm) {

    // without any delimiter!
    return hhMm.substr(0, 2) * 3600 + hhMm.substr(2, 3) * 60;

};

exports.hhMm2Sec = hhMm2Sec;

function splitHhMm(hhMm) {

    return {
        hour : hhMm.substr(0, 2),
        min : hhMm.substr(2, 3)
    };

}

//
//
//
var getSun = function (today, yesterday) {

    var sr_t = splitHhMm(today[0]),
        ss_t = splitHhMm(today[1]),
        dl_t = hhMm2Sec(today[1]) - hhMm2Sec(today[0]),
        sr_y,
        ss_y,
        dl_y = 0,
        dld = '',
        mm;

    if (yesterday !== null) {
        sr_y = splitHhMm(yesterday[0]);
        ss_y = splitHhMm(yesterday[1]);
        dl_y = hhMm2Sec(yesterday[1]) - hhMm2Sec(yesterday[0]);
        dld = dl_t - dl_y;
    }

    dl_t = sec2HhMm(dl_t);

    if (dld !== '') {
        mm = dld / 60;
        if (mm.toString().length === 1) {
            mm = mm === 0 ? '±' + mm : '+' + mm;
        }
        dld = mm;
    }

    return {
        sr : sr_t,
        ss : ss_t,
        dl : dl_t,
        dld : dld
    };

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
