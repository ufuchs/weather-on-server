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
    path = require('path'),
    moment = require('moment'),
    when = require('when'),
    nodefn = require("when/node/function");

(function (undefined) {

    var filenames,

        VERSION = "0.3.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        cfg,
        templatesDir,
        weatherDir,
        output = { 'in' : {}, out : {} };

    // Gets the css-file name for a given `device` and `lang`.
    // Returns the css-file name which is related to the `lang',
    // otherwise the default css-file name
    //
    // @param {cssFiles}
    // @return Object
    //
    // @api private

    function cssFilename(params) {

        var cssFiles = params.cssFiles;

        if (cssFiles.length > 1) {
            throw new Error('only one css-file expected.');
        }

        params.filenames['in'].cssFile = cssFiles[0] === undefined  ? params.location.device + '.css' : cssFiles[0];

        return params;

    }

    //
    //
    //
    function targetDirname(params) {

        params.filenames.out.targetDir  = weatherDir
            + '/' + params.location.device
            + '/' + params.location.id;

        return params;
    }

    //
    //
    //
    function weatherFilenames(params) {

        var fn = cfg.weatherPool.fileNames,
            targetDir = params.filenames.out.targetDir + '/';

        params.filenames['in'].svgTemplate = templatesDir
            + '/'
            + cfg.templatesPool.devices[params.location.device];

        params.filenames.out.weatherSvg   = targetDir + fn.weatherSvg;
        params.filenames.out.unweatherPng = targetDir + fn.unweatherPng;
        params.filenames.out.weatherPng   = targetDir + fn.weatherPng;

        return params;

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Provides the filenames for a given device and language.
     *
     * @ param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    filenames = function (config) {

        cfg = config;
        templatesDir = path.resolve(cfg.templatesPool.dir);
        weatherDir = path.resolve(cfg.weatherPool.dir);

    };

    //
    //
    //
    filenames.get = function (location, cb) {

        var deviceDir = weatherDir + '/' + location.device,
            readdir = nodefn.lift(fs.readdir);

        readdir(deviceDir)
            .then(function (cssFiles) {
                console.log(cssFiles);
                return {
                    cssFiles : cssFiles.filter(function (file, index, array) {
                        return location.lang === file.substr(0, file.indexOf('-'));
                    }),
                    filenames : output,
                    location : location
                };
            })
            .then(cssFilename)
            .then(targetDirname)
            .then(weatherFilenames)
            .then(function (filenames) {
                cb(null, {location : location, filenames : filenames.filenames});
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
