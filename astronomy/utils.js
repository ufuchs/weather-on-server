/*jslint node: true */
/*jslint todo: true */

/*!
 * utils
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

'use strict';

// Splits the `sec` into a `hour` and a `minute` part
//
// @param {sec} Integer
// @return {hour, minute} Object
exports.sec2HhMm = function (sec) {

    var hour = String(Math.floor(sec / 3600)),
        min = String(Math.floor((sec % 3600) / 60));

    if (hour.length === 1) {
        hour = '0' + hour;
    }

    if (min.length === 1) {
        min = '0' + min;
    }

    console.log(hour.length);

    return {
        min : min,
        hour : hour
    };

};