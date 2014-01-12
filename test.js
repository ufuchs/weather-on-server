/*jslint node: true */
/*jslint todo: true */

// http://mathnotepad.com/
'use strict';


var floor = Math.floor,
    suncalc = require('suncalc'),
    moment = require('moment'),
    sr = 1364532520464 - 86400 * 1000,
    ss = 1364578544715,
    dld = floor((ss - sr) / 1000);

//console.log(moment(sr).toString());
//console.log(moment(ss).toString());


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

//
//
//
function sec2hhmmss(sec) {

    var reminder = sec % 3600;  // remaining seconds of the last hour

    return {
        hh : floor(sec / 3600),
        mm : floor(reminder / 60),
        ss : reminder % 60
    };

}

//
//
//
function dayLenghtDiff(today, lat, lon) {

    var today_ = new Date(today),

        sunToday = suncalc.getTimes(today_, lat, lon),
        sunYesterday = suncalc.getTimes(today_ - 86400 * 1000, lat, lon),
        dlToday = moment(sunToday.sunset).valueOf() - moment(sunToday.sunrise).valueOf(),
        dlYesterday = moment(sunYesterday.sunset).valueOf() - moment(sunYesterday.sunrise).valueOf();

    return floor((dlToday - dlYesterday) / 1000);

}

console.log(new Date(1364595184000));

console.log(dayLenghtDiff(1364595184000, 52.52, 13.38));

/*
var sun1 = suncalc.getTimes(new Date(1364595184000 - 86400 * 1000), 52.52, 13.38);
var sun2 = suncalc.getTimes(new Date(1364595184000), 52.52, 13.38);
console.log(sun1.sunrise, ' : ', sun1.sunset);
console.log(sun2.sunrise, ' : ', sun2.sunset);

var dl1 = moment(sun1.sunset).valueOf() - moment(sun1.sunrise).valueOf();
var dl2 = moment(sun2.sunset).valueOf() - moment(sun2.sunrise).valueOf();
var dld = floor((dl2 - dl1) / 1000);

console.log(dld);
console.log(sec2hhmmss(dld));
*/
/*
1364595184000
1364532520464
1095379199.00

console.log(sec2hhmmss(dld));
console.log(reduce_hhmmss2hhmm({ hh: 12, mm: 47, ss: 44 }));
console.log(leadingZero('01'));
*/
