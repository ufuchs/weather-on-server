/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * index
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

/**
 * Dependencies
 */

var fs = require('fs.extra'),
    path = require('path'),
    request = require('request'),

    wunderground = require('./lib/provider/wunderground.js'),
    CFG = require('./app-config.js'),
    localizer = require('./lib/localizer.js'),

    filenames = require('./lib/filenames.js'),

    utils = require('./lib/utils.js'),

    demoWeather = require('./test/2013-03-29.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    locations = require('./locations.json').locations;

(function (undefined) {

    var filenames,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);



    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function Filenames(config) {

    }

    /** 
     * Provides the filenames for a given device and language.
     *
     * @ param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    filenames = function (config) {
        return new Filenames(config);
    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = filenames;
    }

}).call(this);