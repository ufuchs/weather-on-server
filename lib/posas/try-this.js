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
/*
function process(date, lon, lat) {

    var d = julian.localTime2TimeArr(date),
        jd = julian.calendarGregorianToJdA.apply(this, d),
        p = {
            jd0 : julian.jdAtMidnight(jd),
            jd : jd,
            T : julian.j2000Century(jd)
        };

////////////////////////////////////////////////////////////////////////////////

    p.phi = lat;
    p.L = lon * -1.0;
//    p.gmst0 = sidereal.calcGmst(p.jd0);
    p.gmst0 = sidereal.calcGast0(p.jd0);
    p.gmst0IAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd0) / 86400);
    p.gmst = sidereal.calcGmst(p.jd);
    p.gmstIAU82 = julian.dec2hhmmss(sidereal.calcGmstIAU82(p.jd) / 86400);

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
var d = new Date(2014, 8 - 1, 2, 21, 16, 0);
var lon = 13.28,
    lat = 52.30
console.log(d.toString());
process(d, lon, lat);

// http://www.datum-und-uhrzeit.de/
*/

var jd_of_1988_April_10 = 2446895.5,
    T = julian.j2000Century(jd_of_1988_April_10),
    actual,
    expected = 23.440946290957324,

    expected_Δε = 0.002629995763497817,     //  9°.46798474859214
    expected_Δψ = -0.0010729882875282794,   // -3°.8627578351018057
    cos = Math.cos(expected_Δε * base.DEG2RAD),
    res = (cos * expected_Δψ) / 15;

console.log(base.degdec2degmmss(expected_Δψ));

console.log(base.degdec2degmmss(res));


    //     s = (float64((d*60+m)*60) + s) / 3600
    console.log(base.horner(T, [60, 21.448, 26, 23]));


/*
func DMSToDeg(neg bool, d, m int, s float64) float64 {
    s = (float64((d*60+m)*60) + s) / 3600
    if neg {
        return -s
    }
    return s
}

*/
