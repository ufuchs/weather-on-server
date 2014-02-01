/*jslint node: true */
/*jslint todo: true */

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

var FS = require('fs.extra'),
    path = require('path'),
    appCfg = require('./../weather-config.js'),
    Q = require('q'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var configurator = {};

    /**
     * Configures a new workflow object
     *
     * @param {location} Object - comes from the request
     * @return Object - the configured workflow object
     *
     * @api public
     */

    configurator.configure = function (wfo) {

        var r = wfo.cfg.request,
            d = wfo.cfg.display = appCfg.getDisplay(r.device);

        function loadSvgTemplate(filename) {
            return utils.readTextFileW(filename)
                .then(function (svgTemplate) {
                    wfo.cfg.svgTemplate = svgTemplate;
                    return wfo;
                });
        }

        // Look at a language specific css file like 'ru-kindle4nt'
        function getCssFilename(wfo) {

            var deviceDir = appCfg.getDeviceDir(r.device),
                cssFile = r.device + '.css',
                cssFile_LangSpecific = r.lang + '-' + cssFile,
                deferred = Q.defer();

            FS.exists(path.join(deviceDir, cssFile_LangSpecific), function (exists) {
                if (exists) {
                    d.cssFile = cssFile_LangSpecific;
                } else {
                    d.cssFile = cssFile;
                }
                deferred.resolve(wfo);
            });

            return deferred.promise;

        }

        function makeTargetDir(wfo) {
            return utils.mkdirW(d.targetDir)
                .then(function () {
                    return wfo;
                });
        }

        d.basename = appCfg.getPngFilename();
        d.targetDir = appCfg.getTargetDir(r.device, r.id.toString());

        return loadSvgTemplate(appCfg.getSvgTemplate(r.device))
            .then(getCssFilename)
            .then(makeTargetDir);

    };

    /**
     * Expose `configurator`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = configurator;
    }

}());
