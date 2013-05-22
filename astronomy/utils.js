/*jslint node: true */
/*jslint todo: true */

'use strict';

//
//
//
function sec2HhMm(sec) {

    return {
        min : Math.floor((sec % 3600) / 60),
        hour : Math.floor(sec / 3600)
    };

}

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


