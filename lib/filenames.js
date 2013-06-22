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
    Q = require('q');

(function (undefined) {

    var filenames,

        VERSION = "0.3.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        targetDir,
        cfg,
        reqParams,
        templatesDir,
        weatherDir;

    //
    //
    //
    function readdir(dir) {

        var deferred = Q.defer();

        fs.readdir(dir, function (err, files) {

            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(files);
            }

        });

        return deferred.promise;

    }

    // Gets the css-file name for a given `device` and `lang`.
    // Returns the css-file name which is related to the `lang',
    // otherwise the default css-file name
    //
    // @return Object
    //
    // @api private

    function cssFileName(cssFiles) {

        var file,
            cssFile,
            fileNames = { 'in' : {}, out : {} },
            i;

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

        return fileNames;

    }

    //
    //
    //
    function weatherFilenames(fileNames) {

        var fn = cfg.weatherPool.fileNames,
            dir = targetDir
                + '/'
                + reqParams.id
                + '/';

        fileNames['in'].svgTemplate = path.resolve(templatesDir
            + '/'
            + cfg.templatesPool.devices[reqParams.device]);

        fileNames.out.weatherSvg = path.resolve(dir + fn.weatherSvg);
        fileNames.out.unweatherPng = path.resolve(dir + fn.unweatherPng);
        fileNames.out.weatherPng   = path.resolve(dir + fn.weatherPng);

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

        targetDir = weatherDir
            + '/'
            + reqParams.device;

        readdir(targetDir)
            .then(cssFileName)
            .then(weatherFilenames)
            .then(function (l) {
                cb(l);
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
