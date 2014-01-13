/*jslint node: true */
/*jslint todo: true */

'use strict';

var astro = require('../lib/astronomy/utils.js');

describe("weatherProcessor", function () {

    it("shouldn't be null or undefined", function () {
        var dld = astro.dayLenghtDiff(1364595184000, 52.52, 13.38);
        console.log(dld);
    });

});
