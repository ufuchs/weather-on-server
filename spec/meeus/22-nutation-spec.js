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

    console.log(deg, min, sec);
}

//
//
//
describe("", function () {

    var T = //-0.127296372348,
            julian.j2000Century(jd_of_1988_April_10),
        actual,
        expected = 108.53437047264285;


    console.log(T);

    it("", function () {

        actual = nutation.calcMeanObliquityLaskar(T);//calcMeanObliquity(T);

        console.log(actual);

        x(actual);

        var n = nutation.calcApproxNutation(T);

        console.log(n);

        actual += n.Δε;

        x(actual);

        x(n.Δψ);


    });

    it("", function () {

        actual = nutation.calcMeanObliquityLaskar(T);

//        console.log(actual);

//        expect(expected).toBe(actual.H0);

    });


});
