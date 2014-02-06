/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * weatherProcessor
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

 // https://developers.google.com/closure/compiler/?csw=1

/**
 * Dependencies
 */

var configurator = require('./configurator.js'),
    svgEngine = require('./svgEngine.js'),
    Q = require('q');

(function () {

    'use strict';

    var extractor,
        weatherProcessor = {

            prepare : function (ex) {
                extractor = ex;
            },

            process : function (wfo) {

                return Q.when(extractor.extract(wfo))
                    .then(configurator.configure)
                    .then(svgEngine.process);

            }

        };


    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
