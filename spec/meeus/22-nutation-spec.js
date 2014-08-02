/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base.js'),
    nutation = require('./../../lib/posas/meeus/nutation.js'),
    solar = require('./../../lib/posas/meeus/solar.js'),
    julian = require('./../../lib/posas/meeus/julian.js'),
    jd_of_1988_April_10 = 2446895.5;


function x(a) {

    var deg = ~~a,
        f = a - deg,
        sec,

        min = f * 60;
        sec = (min - ~~min) * 60;
        min = ~~min;
//        min = f - ~~f;
//        sec = f;

    console.log(deg, min, sec.toFixed(3));
}

//
//
//
describe("", function () {

    var T = julian.j2000Century(jd_of_1988_April_10),
        actual,
        expected = 108.53437047264285;


    console.log(T);

    it("", function () {

        actual = nutation.calcMeanObliquity(T);

        console.log(actual);

        x(actual);

        actual = nutation.calcMeanObliquityLaskar(T);

        console.log(nutation.calcApproxNutation(T));

        x(actual + nutation.calcApproxNutation(T).['Δε']);





//        expect(expected).toBe(actual.H0);

    });

    it("", function () {

        actual = nutation.calcMeanObliquityLaskar(T);

//        console.log(actual);

//        expect(expected).toBe(actual.H0);

    });


});
