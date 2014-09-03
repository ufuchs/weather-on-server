/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var suncalc = require('./suncalc.js'),

//    d = new Date(),
//    d = new Date(2014, 9 - 1, 22, 5, 0, 0),
    d = new Date(2014, 1 - 1, 1, 5, 0, 0),

    lon = 13.4114,
    lat = 51.5234,
    res;

res = suncalc.getTimes(d, lat, lon);

console.log(res);

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm

    // 0.9983247222612799,
    // 0.9983247826150301,
    // 0.9983253716082243

0.9983243723463882,
0.9983242954165661,
0.9983247472809458
