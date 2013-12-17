/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * downloader
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 */

var request = require('request'),
    when = require('when'),
    demoWeather = require('./provider/2013-03-29.json');

(function () {

    var downloader,
        provider,
        proxy,
        useTestData = false;

    /**
     *
     *
     * @param {cfg} Object - comes from `app-config.js`
     *
     * @api private
     */

    function createRequestParams(lang, location) {

        return {
            uri : provider.getApiUri(lang, location),
            proxy : proxy
        };

    }

    ////////////////////////////////////////////////////////////////////////////

    /**
     *
     *
     * @param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    downloader = function (aProvider, aProxy) {
        provider = aProvider;
        proxy = aProxy;
    };

    /**
     * paritial Copyright(c) Vincent Schoettke
     *
     * Submits a request and fetchs the response, the weather data.
     *
     * @param {params} data object
     * @return data object
     *
     * @api public
     */

    downloader.download = function (lang, location) {

        var d = when.defer(),
            reqParams = createRequestParams(lang, location);

        if (useTestData) {

            d.resolve(demoWeather);

        } else {

            request(reqParams, function (err, res, body) {

                if (err) {

                    d.reject(err);

                } else {

                    try {
                        d.resolve(JSON.parse(body));
                    } catch (jsonErr) {
                        d.reject(jsonErr);
                    }

                }

            });

        }

        return d.promise;

    };

    /**
     *
     * @param {enable} int
     *
     * @api public
     */

    downloader.useTestData = function (enable) {
        useTestData = enable;
    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `downloader`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = downloader;
    }

}());



