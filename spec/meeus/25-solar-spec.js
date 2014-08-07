/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var base = require('./../../lib/posas/meeus/base.js'),
    solar = require('./../../lib/posas/meeus/solar.js'),
    julian = require('./../../lib/posas/meeus/julian.js'),
    jd_of_1992_Oct_13 = 2448908.5,
    jd_of_2007_Dec_14 = 2454449.5;

//
// @see : MEEUS, Astronomical Algorithms (Second Edition), p. 165
//        example 25.a
describe("Solar Coordinates", function () {

    var jd = jd_of_1992_Oct_13,

        // To make the calculation resistend against race condition, we hold all
        // results into an object.
        // This object will be passed through all calculations.
        s = {};

    s.T = julian.j2000Century(jd);

    it("needs the param 'T' at first. It's the base of all further calculations", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var T = -0.07218343600273786;
        //  T = -0.072 183 436;

        expect(s.T).toBe(T);

    });

    it("calculates finally the values of Sun's true longitude and true anomaly", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcTrueLonAndTrueAnomaly(s),
            L0   = 201.80719336623952,//201.80719650670744,
        //  L0   = 201.80720
            M    = 278.9925727892901,
        //  M    = 278.99397
            C    = -1.8973301894817716,
        //  C    = -1.89732
            dotO = 199.90986317675774,
        //> dotO = 199.90988
            v    =  277.09524259980833;
        //  The True Anomaly is not listed in the example

        // The input params to calc finally the Sun's true longitude and true anomaly
        expect(s.L0).toBe(L0);
        expect(s.M).toBe(M);
        expect(s.C).toBe(C);            // Sun's equation of the center

        expect(s.dotO).toBe(dotO);      // Sun's true longitude
        expect(s.v).toBe(v);            // Sun's true anomaly

    });

    it("calculates the Sun's radius vector", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcRadiusVector(s),
            R  = 0.997663301928939,
        //  R  = 0.99766
            e = 0.01670560028506457;
        //  e = 0.016711668

        expect(s.e).toBe(e);            // eccentricity of the Earth
        expect(s.R).toBe(R);            // Sun's radius vector

    });

    it("calculates the mean obliquity of the ecliptic", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcMeanObliquity(s),
            epsilon0 = 23.440229681819808,
        //  ε0       = 23.44023
            epsilon  = 23.440144214673726;
        //  ε        = 23.43999

        expect(s.epsilon0).toBe(epsilon0);
        expect(s.epsilon).toBe(epsilon);

    });

    it("calculates the Sun's apparent longitude", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcAppLon(s),
            Omega  = 264.657131805429,
        //> Ω      = 264.65,
            lambda = 199.90893240913303;
        //> λ      = 199.90895

        expect(s.Omega).toBe(Omega);
        expect(s.lambda).toBe(lambda);

    });

    it("calculates the Sun's Apparent Right Ascension and Declination", function () {

        // Comments refer to the values of:
        //   MEEUS, Astronomical Algorithms (Second Edition), p. 165
        //   example 25.a
        var actual = solar.calcAppPosition(s),
            alpha = 198.3808274561914,
        //  α     = 198.38083.
            delta = -7.785039305745461;
        //  δ     = -7.78507

        expect(s.alpha).toBe(alpha);
        expect(s.delta).toBe(delta);

        console.log(s);

    });

});
