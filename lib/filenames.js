/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * filenames
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ An optimist is a person who sees a green light everywhere, while a  ]
 * [ a pessimist sees only the red stoplight... the truly wise person is ]
 * [ colorblind.                                   - Albert Schweitzer - ]
 */

/**
 * Dependencies
 */

var fs = require('fs.extra'),
    path = require('path');

(function (undefined) {

    var filenames,

        VERSION = "0.2.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        targetDir,
        cfg,
        reqParams,
        templatesDir,
        weatherDir;

    // Gets the css-file name for a given `device` and `lang`.
    // Returns the css-file name which is related to the `lang',
    // otherwise the default css-file name
    //
    // @return Object
    //
    // @api private

    function cssFileName(cb) {

        var file,
            cssFile,
            i,
            fileNames = {};

        fileNames['in'] = {};

        fs.readdir(targetDir, function (err, cssFiles) {

            for (i = 0; i < cssFiles.length; i += 1) {

                file = cssFiles[i];

                if (reqParams.lang === file.substr(0, file.indexOf('-'))) {
                    // e.g 'ru-kindle4nt.css'
                    cssFile = file;
                    break;
                }

            }

            if (cssFile === undefined) {
                // e.g 'kindle4nt.css'
                cssFile = reqParams.device + '.css';
            }

            fileNames['in'].cssFile = cssFile;

            cb(fileNames);

        });

    }

    //
    //
    //
    function getWeatherFilenames(fileNames, callback) {

        var fn = cfg.weatherPool.fileNames,
            dir = targetDir
                + '/'
                + reqParams.id
                + '/',

            svgTemplateFilename = templatesDir
                + '/'
                + cfg.templatesPool.devices[reqParams.device];

        fileNames['in'].svgTemplate = svgTemplateFilename;
        fileNames.out = {};

        fileNames.out.weatherSvg = path.resolve(dir + fn.weatherSvg);
        fileNames.out.unweatherPng = path.resolve(dir + fn.unweatherPng);
        fileNames.out.weatherPng   = path.resolve(dir + fn.weatherPng);

        callback(fileNames);

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     *
     * @api private
     */

    function Filenames(config) {

        cfg = config;
        templatesDir = cfg.templatesPool.dir;
        weatherDir = cfg.weatherPool.dir;

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

    //
    //
    //
    filenames.get = function (newReqParams, callback) {

        reqParams = newReqParams;

        targetDir = weatherDir
            + '/'
            + reqParams.device;

        // Get the device and language depending css-file first
        cssFileName(function (fileNames) {

            // the merge it whit the rest
            getWeatherFilenames(fileNames, callback);

        });

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
