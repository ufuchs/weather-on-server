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

var fs = require('fs.extra');

(function (undefined) {

    var prepare,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),

        svgPool,
        weatherPool;

    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function Prepare(config) {

        svgPool = config.svgPool;
        weatherPool = config.weatherPool;

    }

    /** 
     * Prepares the infrastructure
     *
     * @ param {cfg} Object - comes from `app-config.js`
     *
     * @api public
     */

    prepare = function (cfg) {
        return new Prepare({
            svgPool : cfg.svgPool.dir,
            weatherPool : cfg.weatherPool.dir
        });
    };

    //
    //
    //
    prepare.makeLocationDirByDevice = function (params, callback) {

        var targetDir = weatherPool + '/' + params.device + '/' + params.id;

        fs.exists(targetDir, function (exists) {

            if (!exists) {
                fs.mkdir(targetDir, function (err) {
                    callback(err);
                });
            }

            callback(null);

        });

    };

    //
    //
    //
    prepare.makeWeatherDir = function (params, cb) {

        fs.exists(weatherPool, function (exists) {

            if (!exists) {

                fs.copyRecursive(svgPool, weatherPool, function (err) {

                    if (err) {
                        cb(err);
                    }

                    fs.rmrf(weatherPool + '/df3120/app-dir', function (err) {

                        if (err) {
                            cb(err);
                        }

                        fs.rmrf(weatherPool + '/kindle4nt/app-dir', function (err) {

                            if (err) {
                                cb(err);
                            }

                            prepare.makeLocationDirByDevice(params, function (err) {
                                console.log('Weather-Dir neu angelegt');
                                cb(err);
                            });

                        });

                    });

                });

            } else {

                prepare.makeLocationDirByDevice(params, function (err) {
                    cb(err);
                });

            }

        });

    };

    ///////////////////////////////////////////////////////////////////////////

    prepare.fn = Prepare.prototype = {

        makeWeatherDir : function (params, cb) {
            prepare.makeWeatherDir(params, function (err) {
                cb(err);
            });
        }

//        makeLocationByDevice : function        

    };

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = prepare;
    }

}).call(this);