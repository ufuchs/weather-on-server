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
//    p.n = nutation.calc(T);

    p.gast0 = sidereal.calcGast0(p.jd) * 360.0;
    p.gmst = sidereal.calcGmst(p.jd) * 360;

////////////////////////////////////////////////////////////////////////////////

    alphaDelta = solar.process(p.jd);

    p.alpha = alphaDelta.alpha;
    p.delta = alphaDelta.delta;

////////////////////////////////////////////////////////////////////////////////

    p = rise.process(p);


    console.log(julian.dec2hhmmss(p.m[1] + p.tzo),  julian.dec2hhmmss(p.m[2] + p.tzo));
    console.log(julian.dec2hhmmss(p.m[0] + p.tzo));
    console.log(julian.dec2hhmmss(p.m[2] - p.m[1]));


}

var d = new Date();
//console.log(d.toString());

var lon = 13.4114,
    lat = 51.5234;
    process(d, lon, lat);
finish = new Date();

console.log(finish.valueOf() - start.valueOf())

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm

