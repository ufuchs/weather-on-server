/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * downloader
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 * [ A pessimist sees the difficulty in every opportunity; an optimist ]
 * [ sees the opportunity in every difficulty.   - Winston Churchill - ]
 */

var request = require('request'),
    when = require('when'),
    demoWeather = require('./provider/wunderground/2013-03-29.json');

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

    downloader = function (aProvider, aApiKey, aProxy) {

        provider = aProvider;
        provider(aApiKey);
        proxy = aProxy;

    };

    /**
     * partial copyright(c) Vincent Schoettke
     *
     * Submits a request and fetchs the response, the weather data.
     *
     * @param {params} data object
     * @return data object
     *
     * @api public
     */

    downloader.download = function (wfo) {

        var d = when.defer(),
            reqParams = createRequestParams(wfo.location.lang, wfo.location.name);

        if (useTestData) {

            wfo.json = demoWeather;
            d.resolve(wfo);

        } else {

            request(reqParams, function (err, res, body) {

                if (err) {

                    d.reject(err);

                } else {

                    try {

                        wfo.json = JSON.parse(body);
                        d.resolve(wfo);

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



