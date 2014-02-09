/*jslint node: true */
/*jslint todo: true */

/*!
 * providerDAO
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 * [ A pessimist sees the difficulty in every opportunity; an optimist ]
 * [ sees the opportunity in every difficulty.   - Winston Churchill - ]
 */

var request = require('request'),
    demoWeather = require('./provider/wunderground-2013-03-29.json'),
    Q = require('q');

(function () {

    'use strict';

    var provider,

        proxy,

        localProvider = {

            prepare : function () {},

            retrieve : function (wfo) {
                return demoWeather;
            }

        },

        remoteProvider = {

            prepare : function (aProvider, aProxy) {
                provider = aProvider;
                proxy = aProxy;
            },

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

            retrieve : function (wfo) {

                var d = Q.defer(),
                    r = wfo.cfg.request,
                    reqParams = {
                        uri : provider.getApiUri(r.lang, r.name),
                        proxy : proxy
                    };

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

                return d.promise;

            }

        };

    function Provider(remoteProvider) {

        if (remoteProvider === undefined || remoteProvider === null) {
            provider = localProvider;
        } else {
            provider = remoteProvider;
        }

    }

    Provider.prototype = {
        retrieve : function (wfo) {
            provider.retrieve(wfo);
        }
    };

    provider = function (remoteStorage) {
        return new Provider(remoteStorage);
    };


    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `provider`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = provider;
    }

}());



