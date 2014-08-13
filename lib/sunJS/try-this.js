/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    solar = require('./meeus/solar.js'),
    deltat = require('./meeus/deltat.js'),
    nutation = require('./meeus/nutation.js'),
    rise = require('./meeus/rise.js'),
    start = new Date(),
    finish;

////////////////////////////////////////////////////////////////////////////////

//
//
//
var processSingleDay = function(jd, ε) {

    var T = julian.j2000Century(jd),
        dot0 = solar.calcTrueLonAndTrueAnomaly(T);

    return solar.calcAppPosition(T, dot0, ε);

    // var T = julian.j2000Century(jd);

    // return Q.when(solar.calcTrueLonAndTrueAnomaly(T))
    //     .then(function (dotO) {
    //         return solar.calcAppPosition(T, dot0, ε);
    //     }).
    //     done();

};

//
//
//
var processThreeDays = function(jd, ε) {

    var jd0 = julian.jdAtMidnight(jd),
        appPositions = [jd0 - 1, jd0, jd0 + 1].map(function (day) {
            console.log(day);
            return processSingleDay(day, ε);
        });

    return {
        alpha : appPositions.map(function (ap) { return ap.alpha; }),
        delta : appPositions.map(function (ap) { return ap.delta; })
    };

};

////////////////////////////////////////////////////////////////////////////////


function process(date, lon, lat) {

    var d = julian.localTime2TimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        deltaT = deltat.poly2005to2050Nasa(d[0]) / 86400,
        alphaDelta,

        p = {

            phi : lat,
            L : lon * -1.0,
            tzo : date.getTimezoneOffset() / -1440,

            h0 : -0.833,        // 'standard' altitude of the center of the body

            jd : jd,
            deltaT : deltaT

        };

////////////////////////////////////////////////////////////////////////////////

    p.n = nutation.calc(julian.j2000Century(julian.jdAtMidnight(jd)));


////////////////////////////////////////////////////////////////////////////////

    alphaDelta = processThreeDays(p.jd, p.n.ε);

    p.gast0 = (sidereal.calcGmst0(p.jd) + (p.n.ra / 86400)) * 360.0;

    p.gmst = sidereal.calcGmst(p.jd) * 360;


    p.alpha = alphaDelta.alpha;
    p.delta = alphaDelta.delta;

////////////////////////////////////////////////////////////////////////////////

    p = rise.process(p);

    console.log(p);

   console.log(julian.dec2hhmmss(p.m[1] + p.tzo),  julian.dec2hhmmss(p.m[2] + p.tzo));
   console.log(julian.dec2hhmmss(p.m[0] + p.tzo));
//    console.log(julian.dec2hhmmss(p.m[2] - p.m[1]));


}

var d = new Date();
//var d = new Date(2013, 3 - 1, 29, 5, 0, 0);
console.log(d.toString());

var lon = 13.4114,
    lat = 51.5234;
    process(d, lon, lat);
finish = new Date();

//console.log(finish.valueOf() - start.valueOf())

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm

