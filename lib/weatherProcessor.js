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

var locales = require('./../locales/locales.js').locales,
    kindle4ntProcessor = require('./kindle4ntProcessor.js'),
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

        // weiter nach vorn schieben
        var isoLang = locales.mapIsoToI18n(wfo.cfg.request.lang);

        return processor[wfo.cfg.request.device].process(wfo, isoLang);

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
