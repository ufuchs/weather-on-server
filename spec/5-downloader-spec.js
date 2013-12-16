/*jslint node: true */
/*jslint todo: true */

'use strict';

var downloader = require('../lib/downloader.js');

describe("downloader", function () {

    downloader('xxxx', 'yyy');
    downloader.apiUri();

    it("shouldn't be null", function () {
        expect(downloader).not.toBe(null);
    });


    /*
    it("shouldn't be null", function () {
        downloader.apiKey();
        expect(downloader).not.toBe(null);
    });
*/

});
