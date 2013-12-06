/*jslint node: true */
/*jslint todo: true */

'use strict';

var
    filenames = require('../lib/filenames.js'),
    cfg = require('../weather-config.js'),
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

        filenames.get(location, function (err, data) {
            expect(data).not.toBe(null);
        });

    });


});
