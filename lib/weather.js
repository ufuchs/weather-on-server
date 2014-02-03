/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weather
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

/**
 * Dependencies
 */

var Q = require('q'),
    dataProvider = require('./dataProvider.js'),
    appcfg = require('./../weather-config.js'),
    locales = require('./../locales/locales.js').locales,
    configurator = require('./configurator.js'),
    utils = require('./utils.js'),
    processor = require('./weatherProcessor.js');

(function () {

    var weather;
        // SANTIANO

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Download weather data from provider and transforms it into a PNG file
     *
     * @param {proxy} String
     * @param {apikey} String
     * @param {cachettl} Integer
     *
     * @api public
     */

    weather = function (proxy, apikey, cachettl) {

        dataProvider(appcfg.provider, apikey, proxy);
        utils.moment_applyPatch_de();

    };

    // why do we need a wrapper function?
    // otherwise 'this' of the called function is 'undefined'
    function process(wfo) {

        var isoLang = locales.mapIsoToI18n(wfo.cfg.request.lang);

        return processor.process(wfo, isoLang);

    }

    //
    //
    //
    weather.main = function (request, cb) {

        console.log('request', request.id + ':' + request.device + ':' + request.name);

        Q.when(utils.createWfo(request))
            .then(dataProvider.process)
            .then(configurator.configure)
            .then(process)
            .then(function (fname) {
                cb(null, fname);
            }, function (err) {
                console.log(err);
            });

    };

    /**
     * Expose `weather`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weather;
    }

}());
