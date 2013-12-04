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

    // @param {params}
    // @return Object
    //
    // @api private

    function getInFilenames(params, cb) {

        var deviceDir = productionDir + '/' + params.location.device,
            cssFile = params.location.device + '.css',
            cssFile_LangSpecific = params.location.lang + '-' + cssFile;

        // SVG template
        params.filenames['in'].svgTemplate = templatesDir
            + '/'
            + cfg.templatesPool.devices[params.location.device];

        // CSS file
        // Look at a language specific css file like 'ru-kindle4nt'
        fs.exists(deviceDir + '/' + cssFile_LangSpecific, function (exists) {

            if (exists) {
                params.filenames['in'].cssFile = cssFile_LangSpecific;
            } else {
                params.filenames['in'].cssFile = cssFile;
            }

            cb(null, params);

        });

    }

    // @param {params}
    // @return Object
    //
    // @api private

    function getOutFilenames(params) {

        var fn = cfg.production.files.names,
            targetDir;

        // Target directory in '/public/weather', e.g 'kindle4nt/1'
        targetDir  = productionDir
            + '/' + params.location.device
            + '/' + params.location.id;

        params.filenames.out.targetDir = targetDir;

        targetDir = targetDir + '/';

        // Populated SVG file
        params.filenames.out.weatherSvg   = targetDir + fn.weatherSvg;

        // Uncrushed PNG file
        params.filenames.out.unweatherPng = targetDir + fn.unweatherPng;

        // Crushed PNG file
        params.filenames.out.weatherPng   = targetDir + fn.weatherPng;

        return params;

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
    filenames.get = function (location, cb) {

        var inFilenames = nodefn.lift(getInFilenames),
            params = {
                location : location,
                filenames : {
                    'in' : {},
                    out : {}
                },
                json : null,
                weather : {}
            };

        inFilenames(params)
            .then(getOutFilenames)
            .then(function (outParams) {
                cb(null, outParams);
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
