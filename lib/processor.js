/*jslint node: true */
/*jslint todo: true */

/*!
 * processor
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

/**
 * Dependencies
 */

var when = require('when'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    'use strict';

    var processor = {};

    ////////////////////////////////////////////////////////////////////////////

    /*
     *
     */

    processor.init = function (localizer) {
        this.localizer = localizer;
        return this;
    };

    /*
     *
     */

    processor.prepareSvgTemplate = function (origin, cssFilename) {

        function copySvgTemplate(origin) {
            return origin.substr(0, origin.length + 1);
        }

        return utils.fillTemplates(copySvgTemplate(origin), {
            css : cssFilename
        });

    };

    //
    //
    //
    processor.process = function (wfo, isoLang) {
        this.localizer.prepare(wfo, isoLang);
    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `processor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = processor;
    }

}());


