/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wundergroundReq
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

(function (undefined) {

    var wundergroundAstro,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);



    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function WundergroundAstro(config) {
        return null;
    }

    /** 
     *
     * @api private
     */

    function makeWundergroundAstro(config) {
        return new WundergroundAstro(config);
    }

    /** 
     * 
     * @param {proxy} String
     * @param {apiKey} String 
     * @param {ttl} Integer     
     *
     * @api public
     */

    wundergroundAstro = function (proxy, apiKey, ttl) {

        return makeWundergroundAstro({
            proxy : proxy,
            apiKey : apiKey,
            ttl : ttl
        });

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `filenames`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wundergroundAstro;
    }

}).call(this);