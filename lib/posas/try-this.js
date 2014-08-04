/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var base = require('./meeus/base.js'),
    julian = require('./meeus/julian.js'),
    sidereal = require('./meeus/sidereal.js'),
    solar = require('./meeus/solar.js'),
    deltaT = require('./meeus/deltat.js'),
    rise = require('./meeus/rise.js'),
    Q = require('q');

function process(date, lon, lat) {

    var d = julian.localTime2utcTimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d) + deltaT.poly2005to2050Nasa(2014) / 86400,
        p = {
            d : d,
            jd0 : julian.jdAtMidnight(jd),
            jd : jd,
            T : julian.j2000Century(jd)
        };

    console.log('----------', p);

////////////////////////////////////////////////////////////////////////////////

    p.phi = lat;
    p.L = lon * -1.0;
//    p.gmst0 = sidereal.calcGmst(p.jd0);
    p.gmst0 = sidereal.calcGast0(p.jd0);
    p.gmst0 = base.pmod(p.gmst0, 360)
    console.log(base.pmod(p.gmst0, 360));
//    p.gmst0IAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd0) / 86400);
    p.gmst = sidereal.calcGmst(p.jd);
//    p.gmstIAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd) / 86400);

////////////////////////////////////////////////////////////////////////////////

    var days = [p.jd0 - 1, p.jd, p.jd + 1],

        alphaDelta = days.map(function (day) {
            return solar.process(day);
        });

    p.alpha = alphaDelta.map(function (ad) {
        return ad[0];
    });

    p.delta = alphaDelta.map(function (ad) {
        return ad[1];
    });

////////////////////////////////////////////////////////////////////////////////

    var r = rise.initialize(deltaT.poly2005to2050Nasa(d[0]), -0.8333),
        mx, my;

    r.alpha = p.alpha;
    r.delta = p.delta;
    r.phi = p.phi;
    r.L = p.L;
    r.delta2 = p.delta[1];
    r.alpha2 = p.alpha[1];

    r = rise.calcH0(r);

    r.gmst0 = p.gmst0;

    r = rise.calcMValues(r);

    console.log(r);

    // console.log(julian.dec2hhmmss(r.m[1]), julian.dec2hhmmss(r.m[2]));
    // var _0 = r.m[2] - r.m[1];
    r = rise.interpol(r);




    console.log(julian.dec2hhmmss(r.m[1]),  julian.dec2hhmmss(r.m[2]));
    // var _1 = (julian.dec2hhmmss(r.m[2] - r.m[1]));

    // var _0 = (julian.dec2hhmmss(r.m[2] - r.m[1]));


}
//var d = new Date();
// var d = new Date(2014, 6 - 1, 21, 0, 0, 0);
// var d = new Date(2014, 9 - 1, 23, 0, 0, 0);
//var d = new Date(2014, 8 - 1, 2, 21, 16, 0);
//var d = new Date(2014, 8 - 1, 4, 21, 16, 0);
var d = new Date();
var lon = 13.28,
    lat = 52.30;
console.log(d.toString());
process(d, lon, lat);


console.log(julian.dec2hhmmss(0.29327937495 + 0.5));
// http://www.datum-und-uhrzeit.de/


