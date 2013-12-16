/*jslint node: true */
/*jslint todo: true */

'use strict';

(function () {

    var downLoader,
        apiKey,
        proxy;



    /**
     * Provides the filenames for a given device and language.
     *
     * @param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    downLoader = function (aApiKey, aProxy) {
        apiKey = aApiKey;
        proxy = aProxy;
    };

    downLoader.apiUri = function () {
        console.log(apiKey);
    };

    /**
     * Expose `downLoader`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = downLoader;
    }

}());
