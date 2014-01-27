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

    function xy () {
        console.log('here');
    }

    var weatherProcessor = {

        processor : {},

        init : function (locales) {

            utils.moment_applyPatch_de();

            xy();

            this.processor.kindle4nt = kindle4ntProcessor;
            this.processor.df3120 = df3120Processor;

            return this;

        },

        process : function (wfo) {

            var r = wfo.cfg.request,
                isoLang = locales.mapIsoToI18n(r.lang);

            return this.processor[r.device].process(wfo, isoLang);

        }

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
