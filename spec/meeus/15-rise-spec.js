/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base/base.js'),
    solar = require('./../../lib/posas/meeus/solar/solar.js'),
    julian = require('./../../lib/posas/meeus/julian/julian.js'),
    rise = require('./../../lib/posas/meeus/rise/rise.js'),
    jd_of_1992_Oct_13 = 2448908.5;

//
// rise.calcH0
//
describe("Local hour angle", function () {

    var actual,
        expected = 108.53437047264285,

        // @see : MEEUS, Astronomical Algorithms (Second Edition), p. 103,
        //        example 15.a
        p = {
            phi : 42.3333,      // latitude of Boston
            delta2 : 18.44092,  // for Venus at 1988 March 20, 0h TD
            h0 : -0.5667        // for stars and planets
        };

    it("returns H0", function () {

        actual = rise.calcH0(p);

        expect(expected).toBe(actual.H0);

    });

});
