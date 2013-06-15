/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * prepare
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person reveals his character by nothing so clearly as the joke ]
 * [ he resents..                            - Georg C. Lichtenberg - ]
 */

/**
 * Dependencies
 */

 /**
 * Dependencies
 */

var fs = require('fs.extra'),
    path = require('path');

(function (undefined) {

    var prepare,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);

    //
    //
    //
    function makeTargetDir(params, callback) {

        var svgPool = CFG.svgPool.dir,
            weatherPool = CFG.weatherPool.dir,
            targetDir = weatherPool + '/' + params.device + '/' + params.id;

        fs.exists(targetDir, function (exists) {

            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    callback(err);
                });
            }

            callback(null);

        });

    }


    //
    //
    //
    function process(params, callback) {

        var svgPool = CFG.svgPool.dir,
            weatherPool = CFG.weatherPool.dir;

        fs.exists(weatherPool, function (exists) {

            if (!exists) {

                fs.copyRecursive(svgPool, weatherPool, function (err) {

                    if (err) {
                        callback(err);
                    }

                    fs.rmrf(weatherPool + '/df3120/app-dir', function (err) {

                        if (err) {
                            callback(err);
                        }

                        fs.rmrf(weatherPool + '/kindle4nt/app-dir', function (err) {

                            if (err) {
                                callback(err);
                            }

                            makeTargetDir(params, function (err) {
                                callback(err);
                            });

                        });

                    });

                });

            } else {

                makeTargetDir(params, function (err) {
                    callback(err);
                });

            }

        });

    }


    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function Prepare(config) {

        cfg = config.cfg;
        svgDir = cfg.svgPool.dir;
        weatherDir = cfg.weatherPool.dir;

    }



    /** 
     * Provides the filenames for a given device and language.
     *
     * @ param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    prepare = function (cfg) {
        return makeFilenames({
            cfg : cfg
        });
    };

    ///////////////////////////////////////////////////////////////////////////

    prepare.fn = Prepare.prototype = {



    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = prepare;
    }

}).call(this);