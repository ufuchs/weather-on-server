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

        appCfg;

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function configureSvgFilenames(cfg) {

        var device = cfg.request.device,
            deviceDir = appCfg.getDeviceDir(device),
            cssFile = device + '.css',
            cssFile_LangSpecific = cfg.request.lang + '-' + cssFile,
            d = when.defer();

        cfg.device.singleDayDisplay = appCfg.getSingleDayDisplay(device);

        // SVG template
        cfg.device.svg.template = appCfg.getSvgTemplate(device);

        // CSS file
        // Look at a language specific css file like 'ru-kindle4nt'
        fs.exists(path.join(deviceDir, cssFile_LangSpecific), function (exists) {

            if (exists) {
                cfg.device.svg.cssFile = cssFile_LangSpecific;
            } else {
                cfg.device.svg.cssFile = cssFile;
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

        var targetDir = appCfg.getTargetDir(
                cfg.request.device,
                cfg.request.id.toString()
            );

        cfg.device.png.targetDir = targetDir;

        cfg.device.png.weatherPng = path.join(targetDir, appCfg.getPngFilename());

        return cfg;

    }

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function makeTargetDir(cfg) {

        return utils.mkdirW(cfg.device.png.targetDir)
            .then(function () {
                return cfg;
            });

    }

    // @param {cfg} Object
    // @return Object
    //
    // @api private

    function loadSvgTemplate(cfg) {

        return utils.readTextFileW(cfg.device.svg.template)
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
    };

    /**
     * Creates and configures a new workflow object
     *
     * @param {location} Object - comes from the request
     * @return Object - the configured workflow object
     *
     * @api public
     */

    configurator.configure = function (wfo) {

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
