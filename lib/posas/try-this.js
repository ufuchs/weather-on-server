/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    Q = require('q');


function process(date, deltaT) {

    Q.when(julian.localTime2utcTimeArr(date))
        .then(function (d) { return julian.calendarGregorianToJdA.apply(this, d); })
        .then(function (jd) {
            return {
                jd : jd,
                jd0 : julian.jdAtMidnight(jd, deltaT)
            };
        })
        .then(function (p) {

            p.gmst = julian.dec2hhmmss(sidereal.gmst(p.jd) / 86400);
            p.gmst0 = julian.dec2hhmmss(sidereal.gmst0(p.jd) / 86400);

            return p;

        })
        .then(function (p) {
            console.log(p);
        })
        .done();

}

process(new Date(), 0);
