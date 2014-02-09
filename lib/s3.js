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
    appcfg = require('./../weather-config.js');

(function () {

    'use strict';

    var persist,

        client = s3.createClient(appcfg.aws);

    persist = {

        /*
        putStream : function (res, body) {

            var headers = {
                    'Content-Type' : 'application/json',
                    'x-amz-acl'    : 'public-read'
                },
                remoteFile = "/test/wunderground-2013-03-29.json",

                uploader = client.upload(
                    "wunderground-2013-03-29.json",
                    remoteFile,
                    headers
                );

            uploader.on('error', function (err) {
                console.error("unable to upload:", err.stack);
            });

            uploader.on('progress', function (amountDone, amountTotal) {
                console.log("progress", amountDone, amountTotal);
            });

            uploader.on('end', function (url) {
                console.log("file available at", url);
            });

        }
        */

        putStream : function (res, body) {
            console.log('PERSIST');
        }

    };


    /**
     * Expose `weather`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = persist;
    }

}());
