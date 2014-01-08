/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weatherProcessor
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */

var kindle4ntProcessor = require('./kindle4ntProcessor.js'),
    df3120Processor = require('./df3120Processor.js'),
    utils = require('./utils.js');

(function () {

    var weatherProcessor,
        processor = {};

    //
    //
    //
    weatherProcessor = function (locales) {

        utils.moment_applyPatch_de();

        kindle4ntProcessor(locales);
        processor.kindle4nt = kindle4ntProcessor;

        df3120Processor(locales);
        processor.df3120 = df3120Processor;

    };

    //
    //
    //
    weatherProcessor.process = function (wfo) {

        return processor[wfo.cfg.location.device].process(wfo);
        //                       ^-- comes from request!

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProcessor;
    }

}());
