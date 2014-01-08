/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * dataProvider
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Insanity: doing the same thing over and over again and expecting ]
 * [ different results.                           - Albert Einstein - ]
 */

var when = require('when'),
    fn = require("when/function");

(function () {

    var dataProvider,

        downloader,

        extractor;

    ////////////////////////////////////////////////////////////////////////////

    dataProvider = function (cfg, apiKey, proxy) {

        downloader = cfg.downloader;
        downloader(cfg.query, apiKey, proxy);

        extractor = cfg.extractor;
        extractor();

    };

    dataProvider.process = function (wfo) {

        return downloader.download(wfo)
            .then(extractor.extract);

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `dataProvider`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = dataProvider;
    }

}());