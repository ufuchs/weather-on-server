/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var suncalc = require('./suncalc.js'),
    Q = require('q'),

//s    d = new Date(),
    d = new Date(2014, 9 - 1, 18),
//    d = new Date(2014, 1 - 1, 1, 5, 0, 0),

    lon = 13.4114,
    lat = 51.5234,
    res;

Q.when(suncalc.getTimes(d, lat, lon)).then(function (res) {
    console.log(res);
})

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
