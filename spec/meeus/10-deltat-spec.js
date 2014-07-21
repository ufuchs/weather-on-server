/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var deltaT = require('./../../lib/posas/meeus/deltat/deltat.js');

describe("Calcultes ΔT", function () {

    it("for years after 2000", function () {

        console.log('Nasa ', 2005, deltaT.poly2005to2050Nasa(2005));
        console.log('MEEUS', 2005, deltaT.polyAfter2000Meeus(2005));

        console.log('Nasa ', 2010, deltaT.poly2005to2050Nasa(2010));
        console.log('MEEUS', 2010, deltaT.polyAfter2000Meeus(2010));


    });

});

