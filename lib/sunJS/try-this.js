/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var suncalc = require('./suncalc.js'),

//s    d = new Date(),
    d = new Date(2014, 6 - 1, 21),
//    d = new Date(2014, 1 - 1, 1, 5, 0, 0),

    lon = 13.4114,
    lat = 51.5234,
    res;

res = suncalc.getTimes(d, lat, lon);

console.log(res);

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
