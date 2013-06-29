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
    deferred = require('deferred'),
    readdir = deferred.promisify(fs.readdir);

(function (undefined) {

    var filenames,

        VERSION = "0.3.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        deviceDir,
        cfg,
        reqParams,
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

    function cssFilename(cssFiles) {

        var fileNames = output;

        if (cssFiles.length > 1) {
            throw new Error('only one css-file expected.');
        }

        fileNames['in'].cssFile = cssFiles[0] === undefined  ? reqParams.device + '.css' : cssFiles[0];

        return fileNames;

    }

    //
    //
    //
    function targetDirname(fileNames) {

        fileNames.out.targetDir  = path.resolve(deviceDir + '/' + reqParams.id);

        return fileNames;
    }

    //
    //
    //
    function weatherFilenames(fileNames) {

        var fn = cfg.weatherPool.fileNames,
            targetDir = fileNames.out.targetDir + '/';

        fileNames['in'].svgTemplate = path.resolve(templatesDir
            + '/'
            + cfg.templatesPool.devices[reqParams.device]);

        fileNames.out.weatherSvg   = targetDir + fn.weatherSvg;
        fileNames.out.unweatherPng = targetDir + fn.unweatherPng;
        fileNames.out.weatherPng   = targetDir + fn.weatherPng;

        return fileNames;

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
        templatesDir = cfg.templatesPool.dir;
        weatherDir = cfg.weatherPool.dir;

    };

    //
    //
    //
    filenames.get = function (newReqParams, cb) {

        reqParams = newReqParams;

        deviceDir = weatherDir
            + '/'
            + reqParams.device;

        readdir(deviceDir)
            .invoke('filter', function (file) {
                return reqParams.lang === file.substr(0, file.indexOf('-'));
            })
            .then(cssFilename)
            .then(targetDirname)
            .then(weatherFilenames)
            .then(function (fileNames) {
                cb(null, fileNames);
            })
            .done();

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
