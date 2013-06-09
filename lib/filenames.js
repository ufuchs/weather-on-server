/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * filenames
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var fs = require('fs.extra'),
    path = require('path');

(function (undefined) {

    var filenames,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        cfg,

        svgDir,

        weatherDir;

    // Gets the css-file name for a given `device` and `lang`.
    // Returns the css-file name which is related to the `lang',
    // otherwise the default css-file name
    //
    // @param {device} String
    // @param {lang} String
    // @return String
    //
    // @api private

    function cssFileName(params, cb) {

        var device = params.device,
            deviceCssPath = cfg.svgPool.dir
                + '/'
                + device,
            file,
            fileLang,
            cssFile,
            i;

        fs.readdir(deviceCssPath, function (err, files) {

            i = files.indexOf('app-dir');

            files.splice(i, 1);

            for (i = 0; i < files.length; i += 1) {

                file = files[i];

                fileLang = files[i].substr(0, file.indexOf('-'));

                if (fileLang === params.lang) {
                    cssFile = file;
                    break;
                }

            }

            if (cssFile === null) {
                cssFile = device + '.css';
            }

            cb(cssFile);

        });

    }

    //
    //
    //
    function getWeatherFilenames(params, cssFile, callback) {

        var fn = cfg.weatherPool.fileNames,
            device = params.device,
            dir = weatherDir
                + '/'
                + device
                + '/'
                + params.id
                + '/',
            svgTemplateFilename = svgDir
                + '/'
                + device
                + '/app-dir/'
                + cfg.svgPool.devices[device];


        callback({
            'in' : {
                css : cssFile,
                svg : svgTemplateFilename
            },
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

            cssFileName(params, function (cssFile) {
                getWeatherFilenames(params, cssFile, callback);
            });

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