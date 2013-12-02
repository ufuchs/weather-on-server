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
    when = require('when'),
    nodefn = require("when/node/function");

(function () {

    var filenames,

        VERSION = "0.4.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        cfg,
        templatesDir,
        productionDir;

    // Gets the css-file name for a given `device` and `lang`.
    // Returns the css-file name which is related to the `lang',
    // otherwise the default css-file name
    //
    // @param {cssFiles}
    // @return Object
    //
    // @api private

    function determineCssFilenameForDevice(params) {

        var cssFiles = params.cssFiles,
            cssFile;

        if (cssFiles.length > 1) {
            throw new Error('only one css-file expected.');
        }

        // Check, if there exists any language depending css-file
        if (cssFiles[0] === undefined) {
            // use the standard css-file
            cssFile = params.location.device + '.css';
        } else {
            cssFile = cssFiles[0];
        }

        params.filenames['in'].cssFile = cssFile;

//        params.filenames['in'].cssFile = cssFiles[0] === undefined  ? params.location.device + '.css' : cssFiles[0];

        return params;

    }

    //
    //
    //
    function targetDirname(params) {

        params.filenames.out.targetDir  = productionDir
            + '/' + params.location.device
            + '/' + params.location.id;

        return params;
    }

    //
    //
    //
    function weatherFilenames(params) {

        var fn = cfg.production.files.names,
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
        productionDir = path.resolve(cfg.production.dir);

    };

    //
    //
    //
    filenames.get = function (location, cb) {

        var deviceDir = productionDir + '/' + location.device,
            readdir = nodefn.lift(fs.readdir);

        readdir(deviceDir)
            .then(function (cssFiles) {
                return {
                    cssFiles : cssFiles.filter(function (file, index, array) {
                        return location.lang === file.substr(0, file.indexOf('-'));
                    }),
                    filenames : { 'in' : {}, out : {} },
                    location : location
                };
            })
            .then(determineCssFilenameForDevice)
            .then(targetDirname)
            .then(weatherFilenames)
            .then(function (filenames) {
                console.log('out-getFilenames-'  + location.id, location, filenames.filenames);
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

}());
