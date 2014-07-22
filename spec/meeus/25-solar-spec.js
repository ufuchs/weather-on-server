/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base/base.js'),
    solar = require('./../../lib/posas/meeus/solar/solar.js'),
    jd_of_1987_Apr_10 = 2446895.5;;

//
//
//
describe("JD to century and fraction of the day", function () {

    var jd = jd_of_1987_Apr_10;

    it("returns the same day with f = 0", function () {

        var cfrac = sidereal.jdToCFrac(jd),

        // { jd0: 2446895.5, f: 0 }
        expect(actual.cen).toBe(expected_cen);
        expect(actual.dayFrac).toBe(expected_f);

    });



});
