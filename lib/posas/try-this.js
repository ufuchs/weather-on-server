/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    solar = require('./meeus/solar.js'),
    Q = require('q');


function process(date, deltaT) {

    Q.when(julian.localTime2TimeArr(date))
        .then(function (d) { return julian.calendarGregorianToJdA.apply(this, d); })
        .then(function (jd) {
            return {
                jd0 : julian.jdAtMidnight(jd, deltaT),
                jd : jd,
                T : julian.j2000Century(jd),
            };
        })
        .then(function (p) {

            p.gmst0 = julian.dec2hhmmss(sidereal.calcGmst(p.jd0) / 360);
            p.gmst0IAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd0) / 86400);
            p.gmst = julian.dec2hhmmss(sidereal.calcGmst(p.jd) / 360);
            p.gmstIAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd) / 86400);

            return p;

        })
        .then(function (p) {
            var days = [p.jd0 - 1, p.jd, p.jd + 1],

            result = days.map(function (day) {
                console.log(day);
                var s = solar.process(day)
                console.log('-----------', s);
            });

            return result;

        })
        .then(function (p) {
            console.log(JSON.stringify(p));
        })
        .done();

}

//var d = new Date(1987, 3, 10, 19, 21, 0);
var d = new Date(1992, 10 - 1, 13, 0, 0, 0);
console.log(d.toString());
process(d, 0);
