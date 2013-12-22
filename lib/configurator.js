/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * configurator
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
    utils = require('./utils.js');

(function () {

    var configurator,

        VERSION = "0.4.0",

        appCfg,
        templatesDir,
        productionDir;

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function configureSvgFilenames(cfg) {

        var device = cfg.location.device,
            deviceDir = path.join(productionDir, device),
            cssFile = device + '.css',
            cssFile_LangSpecific = cfg.location.lang + '-' + cssFile,
            d = when.defer();

        // SVG template
        cfg.filenames.svg.template = path.join(templatesDir,
            appCfg.templatesPool.devices[device]);

        // CSS file
        // Look at a language specific css file like 'ru-kindle4nt'
        fs.exists(path.join(deviceDir, cssFile_LangSpecific), function (exists) {

            if (exists) {
                cfg.filenames.svg.cssFile = cssFile_LangSpecific;
            } else {
                cfg.filenames.svg.cssFile = cssFile;
            }

            d.resolve(cfg);

        });

        return d.promise;

    }

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function configurePngFilenames(cfg) {

        var fn = appCfg.production.files.names,
            targetDir = path.join(productionDir,
                cfg.location.device,
                cfg.location.id.toString());

        cfg.filenames.png.targetDir = targetDir;

        cfg.filenames.png.weatherPng = path.join(targetDir, fn.weatherPng);

        return cfg;

    }

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function makeTargetDir(cfg) {

        var targetDir = cfg.filenames.png.targetDir,
            d = when.defer();

        fs.exists(targetDir, function (exists) {

            if (exists) {
                d.resolve(cfg);
            } else {
                fs.mkdir(targetDir, function (err) {
                    if (err) {
                        d.reject(err);
                    } else {
                        d.resolve(cfg);
                    }
                });
            }

        });

        return d.promise;

    }

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function loadSvgTemplate(cfg) {

        return utils.readTextFileEx(cfg.filenames.svg.template)
            .then(function (svgTemplate) {
                cfg.svgTemplate = svgTemplate;
                return cfg;
            });

    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Initialize the configurator
     *
     * @param {config} Object - comes from `app-config.js`
     *
     * @api public
     */

    configurator = function (config) {

        appCfg = config;
        templatesDir = path.resolve(appCfg.templatesPool.dir);
        productionDir = path.resolve(appCfg.production.dir);

    };

    /**
     * Creates and configures a new workflow object
     *
     * @param {location} Object - comes from the request
     * @return Object - the configured workflow object
     *
     * @api public
     */

    configurator.configure = function (location) {

        var wfo = {
                cfg : {
                    svgTemplate : null,
                    location : location,
                    filenames : {
                        svg : {},
                        png : {}
                    }

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
                }
            };

        return configureSvgFilenames(wfo.cfg)
            .then(configurePngFilenames)
            .then(makeTargetDir)
            .then(loadSvgTemplate)
            .then(function () {
                return wfo;
            }, function (err) {
                console.log(err);
            });

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `configurator`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = configurator;
    }

}());
