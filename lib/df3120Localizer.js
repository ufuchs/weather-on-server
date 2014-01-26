/*vim: et:ts=4:sw=4:sts=4 */
/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * localizer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Continuous effort - not strength or intelligence - is the key to  ]
 * [ unlocking our potential.                    - Winston Churchill - ]
 */

/**
 * Dependencies
 */

var fn = require("when/function"),
    when = require('when'),
    parent = require('./localizer.js');

(function () {

    'use strict';

    var localizer = {};

    //
    //
    //
    function dayZero(p, dayNum) {
        return parent.dayZero(p, dayNum);
    }

    //
    // @param {wfo} Object - the workflow object
    //
    function footer(wfo) {
        return parent.footer(wfo);
    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Localizer for the extracted weather data.
     *
     * @return Object
     *
     * @api public
     */

    localizer.init = function (locales) {
//        parent.init(locales);
        return this;
    };

    //
    //
    //
    localizer.prepare = function (wfo, isoLang) {
        parent.prepare(wfo, isoLang);
    };

    /**
     * Localizes the given `wfo` object.
     *
     * @param {wfo} Object - the workflow object
     *
     * @api public
     */

    localizer.localize = function (wfo) {

        return fn.call(dayZero, wfo)
            .then(footer)
            .then(function () {
                return wfo;
            }, function (err) {
                console.log(err);
            });

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `localizer`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = localizer;
    }

}());
