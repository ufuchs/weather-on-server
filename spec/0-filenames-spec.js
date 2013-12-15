/*jslint node: true */
/*jslint todo: true */

'use strict';

var
    filenames = require('../lib/filenames.js'),
    cfg = require('../weather-config.js'),
    fn = require("when/function"),
    location = require('./spec-config.js').location;

filenames(cfg);

//
//
//
describe("locations", function () {

    it("should work", function () {
        expect(filenames).not.toBe(null);
    });

    it("should work", function () {

        fn.call(filenames.get, location)
            .then(function (wfo) {
                console.log(wfo.filenames);
            });

    });

});
