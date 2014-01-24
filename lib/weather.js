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

var when = require('when'),
    fs = require('fs'),
    fn = require("when/function"),
    dataProvider = require('./dataProvider.js'),
    appcfg = require('./../weather-config.js'),
    weatherProcessor = require('./weatherProcessor.js'),
    locales = require('./../locales/locales.js').locales,
    configurator = require('./configurator.js'),
    utils = require('./utils.js'),
    svg2png = require('./svg2png/svg2png.js');

(function () {

    var weather,

        VERSION = "0.4.0";

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
        weatherProcessor.init(locales);
        configurator(appcfg);
        svg2png();

    };

    // why do we need a wrapper function?
    // otherwise 'this' of the called function is 'undefined'
    function process(wfo) {
        return weatherProcessor.process(wfo);
    }

    //
    //
    //
    weather.main = function (request, cb) {

        console.log('request', request.id + ':' + request.device + ':' + request.name);

        when(utils.createWfo(request))
            .then(dataProvider.process)
            .then(configurator.configure)
            .then(process)
            .then(function (filenames) {
                var fname = filenames[request.period];
                request = null;
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
