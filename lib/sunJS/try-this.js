/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var suncalc = require('./suncalc.js'),
    julian = require('./meeus/julian.js'),
    Q = require('q'),

//    d = new Date(),
    d = new Date(2014, 9 - 1, 19),
//    d = new Date(2014, 1 - 1, 1, 5, 0, 0),

    lon = 13.4105,
    lat = 51.5243;

Q.when(suncalc.getTimes(d, lat, lon)).then(function (res) {

    var ydl = 0;

    // res.map(function (day) {

    //     var tzOff = day.tzOff / 1440,
    //         rise = day.rise;// - tzOff,
    //         set = day.set;// - tzOff,
    //         dl = day.dl,
    //         dld = dl - ydl;

    //     if (ydl !== 0) {

    //         console.log(day.date,
    //             julian.dec2hhmmssA(rise),
    //             julian.dec2hhmmssA(set),
    //             julian.dec2hhmmssA(dl),
    //             julian.dec2hhmmssA(dld));
    //     }

    //     ydl = dl;

    // })

}).fail(function (err) {
    console.log(err);
})

// http://www.datum-und-uhrzeit.de/
// http://www.jgiesen.de/astro/suncalc/index.htm
