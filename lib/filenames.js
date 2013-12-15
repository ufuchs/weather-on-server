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
    utils = require('./utils.js'),
    when = require('when'),
    fn = require("when/function");

(function () {

    var filenames,

        VERSION = "0.4.0",

        cfg,
        templatesDir,
        productionDir;

    // @param {params}
    // @return Object
    //
    // @api private

    function getInFilenames(wfo) {

        var deviceDir = path.join(productionDir, wfo.location.device),
            cssFile = wfo.location.device + '.css',
            cssFile_LangSpecific = wfo.location.lang + '-' + cssFile,
            deferred = when.defer();

        // SVG template
        wfo.filenames['in'].svgTemplate = path.join(templatesDir,
            cfg.templatesPool.devices[wfo.location.device]);

        // CSS file
        // Look at a language specific css file like 'ru-kindle4nt'
        fs.exists(path.join(deviceDir, cssFile_LangSpecific), function (exists) {

            if (exists) {
                wfo.filenames['in'].cssFile = cssFile_LangSpecific;
            } else {
                wfo.filenames['in'].cssFile = cssFile;
            }

            deferred.resolve(wfo);

        });

        return deferred.promise;

    }

    // @param {params}
    // @return Object
    //
    // @api private

    function getOutFilenames(wfo) {

        var fn = cfg.production.files.names,
            targetDir = path.join(productionDir,
                wfo.location.device,
                wfo.location.id.toString());

        wfo.filenames.out.targetDir = targetDir;

        wfo.filenames.out.weatherPng = path.join(targetDir, fn.weatherPng);

        return wfo;

    }

    //
    //
    //
    function prepareTargetDir(wfo) {

        var targetDir = wfo.filenames.out.targetDir,
            deferred = when.defer();

        fs.exists(targetDir, function (exists) {

            if (exists) {
                deferred.resolve(wfo);
            } else {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(wfo);
                    }
                });
            }

        });

        return deferred.promise;

    }

    //
    //
    //
    function getSvgTemplate(wfo) {

        return fn.call(utils.readTextFileEx, wfo.filenames['in'].svgTemplate)
            .then(function (svgTemplate) {
                wfo.svgTemplate = svgTemplate;
                return wfo;
            });


    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Provides the filenames for a given device and language.
     *
     * @param {cfg} Object - comes from `app-config.js`
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
    filenames.get = function (location) {

        var wfo = {
                location : location,
                filenames : {
                    'in' : {},
                    out : {}
                },
                json : null,
                weather : {},
                localized : {
                    common : {},
                    header : {
                        date : null,
                        doy : null,
                        sun : {},
                        forecast : {}
                    },
                    forecastday : []
                },
                svgTemplate : null
            };

        return fn.call(getInFilenames, wfo)
            .then(getOutFilenames)
            .then(prepareTargetDir)
            .then(getSvgTemplate);

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = filenames;
    }

}());
