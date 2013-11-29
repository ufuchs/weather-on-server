/*jslint node: true */
/*jslint todo: true */

'use strict';

var
    locations = require('../locations.json').locations;


if (typeof Object.create !== 'function') {

    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };

}

//
//
//
function detectLocationById(id) {

    var i = 0,
        loc;

    for (i = 0; i < locations.length; i += 1) {

        loc = locations[i];

        if (loc.id === id) {
            return loc;
        }

    }

    return null;

}

//
//
//
describe("locations", function () {

    it("should has a location which 'id' equals 1", function () {
        var id_1 = locations[0];
        expect(id_1).not.toBe(null);
    });

    it("should be", function () {
        var xy = detectLocationById(1);
        expect(xy.id).toBe(1);
    });

    it("should be ...", function () {
        var loc = detectLocationById(1),
            locEx = Object.create(loc);

        locEx.device = 'k';
        console.log(locEx.name);
        expect(locEx).not.toBe(null);

    });


});
