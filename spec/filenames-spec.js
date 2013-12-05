/*jslint node: true */
/*jslint todo: true */

'use strict';

var
    filenames = require('../lib/filenames.js'),
    cfg = require('../weather-config.js'),
    location = {
        id: 1,
        lon: ["13.4542", "13° 27"],
        lat: ["52.5158", "52° 31'"],
        name: "Germany/Berlin",
        lang: "ru",
        device: "kindle4nt",
        period: 0

    };


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
