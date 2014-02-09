/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * s3
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

var s3 = require('s3'),
    appcfg = require('./../weather-config.js'),
    demoWeather = require('./provider/wunderground-2013-03-29.json');

(function () {

    'use strict';

    var storage,
        localStorage,
        remoteStorage;

    localStorage = {

        retrieve : function () {
            return demoWeather;
        }

    };

    function Storage(aRemoteStorage) {

        if (aRemoteStorage === undefined || aRemoteStorage === null) {
            storage = localStorage;
        } else {
            storage = remoteStorage;
        }

    }

    Storage.prototype = {
        retrieve : function () {
            storage.retrieve();
        }
    };

    storage = function (aRemoteStorage) {
        return new Storage(aRemoteStorage);
    }

    /**
     * Expose `weather`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = storage;
    }

}());
