/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var suncalc = require('./suncalc.js');
    start = new Date(),

    d = new Date(),
//  d = new Date(2013, 3 - 1, 29, 5, 0, 0);

    lon = 13.4114,
    lat = 51.5234;

console.log(suncalc.getTimes(d, lat, lon));

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
