/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wundergroundEx
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Insanity: doing the same thing over and over again and expecting ]
 * [ different results.                           - Albert Einstein - ]
 */

var when = require('when'),
    fn = require("when/function");

(function () {

    var providerService,

        downloader,

        extractor;

    ////////////////////////////////////////////////////////////////////////////

    providerService = function (cfg, apiKey, proxy) {

        downloader = cfg.downloader;
        downloader(cfg.query, apiKey, proxy);

        extractor = cfg.extractor;
        extractor();

    };

    providerService.process = function (wfo) {

        console.log(wfo.location);

        return fn.call(downloader.download, wfo)
            .then(extractor.extract)
            .then(function (wfo) {
                console.log(wfo.weather);
                return wfo;
            });


    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `downloader`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = providerService;
    }

}());
