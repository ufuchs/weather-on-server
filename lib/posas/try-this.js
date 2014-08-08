/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    solar = require('./meeus/solar.js'),
    deltat = require('./meeus/deltat.js'),
    rise = require('./meeus/rise.js'),
    start = new Date(),
    finish;

function process(date, lon, lat) {

    var d = julian.localTime2utcTimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        deltaT = deltat.poly2005to2050Nasa(d[0]) / 86400,
        alphaDelta,

        p = {
            d : d,
            phi : lat,
            L : lon * -1.0,
            h0 : -0.833,        // 'standard' altitude of the center of the body
            deltaT : deltaT,
            jd0 : julian.jdAtMidnight(jd),// + deltaT,
            jd : jd,
            T : julian.j2000Century(jd)
        };

    console.log(p);

////////////////////////////////////////////////////////////////////////////////

//    p.gast0 = sidereal.calcGast0(p.jd0 + deltaT) * 360.0;
    p.gast0 = sidereal.calcGast0(p.jd0) * 360.0;
    p.gmst = sidereal.calcGmst(p.jd) * 360;

////////////////////////////////////////////////////////////////////////////////

    alphaDelta = solar.process(p.jd0);

    p.alpha = alphaDelta.alpha;
    p.delta = alphaDelta.delta;

////////////////////////////////////////////////////////////////////////////////

    p = rise.process(p);

    console.log(p);

    console.log(julian.dec2hhmmss(p.m[1]),  julian.dec2hhmmss(p.m[2]));
    console.log(julian.dec2hhmmss(p.m[0]));
    console.log(julian.dec2hhmmss(p.m[2] - p.m[1]));

}

//var d = new Date();
//var d = new Date(1992, 10 - 1, 13, 1, 0, 0);
// var d = new Date(2014, 9 - 1, 23, 0, 0, 0);
var d = new Date(2014, 8 - 1, 8, 2, 0, 0);
//var d = new Date(2007, 12 - 1, 14, 14, 54, 30);
//var d = new Date();
// var lon = 13.4114,
//     lat = 51.5234;
console.log(d.toString());
var lon = 13.4114,
    lat = 51.5234;
    process(d, lon, lat);
finish = new Date();

console.log(finish.valueOf() - start.valueOf())


// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm

