/*jslint node: true */
/*jslint todo: true */

'use strict';

var renderer = require('../lib/svg2png-rendererEx.js');


describe("renderer", function () {

    var params = {
        device : "kindle4nt",
        out : "test.png"
    };


    it("shouldn't be null", function () {
        expect(renderer).not.toBe(null);
    });

    it("should render the params", function () {
        console.log(renderer);
        renderer.render('kindle4nt','Test');
        expect(renderer).not.toBe(null);
    });


});

