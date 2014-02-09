/*jslint node: true */
/*jslint todo: true */

/*!
 * downloader
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 * [ A pessimist sees the difficulty in every opportunity; an optimist ]
 * [ sees the opportunity in every difficulty.   - Winston Churchill - ]
 */

var request = require('request'),
    Q = require('q');

(function () {

    'use strict';

    var provider,

//        storage,

        proxy,

        downloader = {

            prepare : function (aProvider, aStorage, aProxy) {
                provider = aProvider;
                storage = aStorage;
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

                            /*
                            if (storage !== undefined && storage !== null) {
                                storage.putStream(res, body);
                            }
                            */
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

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `downloader`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = downloader;
    }

}());



