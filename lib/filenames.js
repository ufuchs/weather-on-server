/*jslint node: true */
/*jslint todo: true */

'use strict';

var moment = require('moment'),
    utils = require('./utils.js'),
    fs = require('fs.extra'),
    path = require('path'),
    CFG = require('./../app-config.js'),
    astro = require('./../astronomy/utils.js');


(function (undefined) {

    var filenames,
        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        cfg,

        params,

        svgDir,

        weatherDir,

        result = {
            'in' : {
                css : null,
                svg : null
            },
            'out' : {
                svg : null,
                unweather : null,
                weather : null
            }
        };

    //
    //
    //
    function getWeatherFilenames(params, callback) {

        var fn = CFG.weatherPool.fileNames,
            dir = weatherDir + '/' + params.device + '/' + params.id + '/';

        callback({
            out : {
                weatherSvg   : path.resolve(dir + fn.weatherSvg),
                unweatherPng : path.resolve(dir + fn.unweatherPng),
                weatherPng   : path.resolve(dir + fn.weatherPng)
            }
        });

    }



    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function Filenames(config) {

        cfg = config.cfg;
        svgDir = cfg.svgPool.dir;
        weatherDir = cfg.weatherPool.dir;

    }

    /** 
     *
     * @api private
     */

    function makeFilenames(config) {
        return new Filenames(config);
    }

    /** 
     * Provides the filenames for a given device and language.
     *
     * @ param {cfg} Object - comes from `app-config.js`
     * @ param {device} String 
     * @ param {lang} String 
     *
     * @api public
     */

    filenames = function (cfg) {
        return makeFilenames({
            cfg : cfg
        });
    };

    ///////////////////////////////////////////////////////////////////////////

    Filenames.prototype = {

        getFilenames : function (params, callback) {
            getWeatherFilenames(params, callback);
        }

    };


    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = filenames;
    }

}).call(this);