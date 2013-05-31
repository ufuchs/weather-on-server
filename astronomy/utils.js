/*jslint node: true */
/*jslint todo: true */

'use strict';

//
//
//
exports.sec2HhMm = function (sec) {

    var hour = Math.floor(sec / 3600),
        min = Math.floor((sec % 3600) / 60);

    if (hour.length === 1) {
        hour = '0' + hour;
    }

    if (min.length === 1) {
        min = '0' + min;
    }

    return {
        min : min,
        hour : hour
    };

}

/*
exports.formatSec2HhMm = function (sec, delimiter) {

    var t = sec2HhMm(sec),
        hh = t.hour.toString(),
        mm = t.min.toString(),
        res;

    if (hh.length === 1) {
        hh = '0' + hh;
    }

    if (mm.length === 1) {
        mm = '0' + mm;
    }

    if (delimiter === undefined) {
        delimiter = '.';
    }

    return hh + delimiter + mm;

}
*/

