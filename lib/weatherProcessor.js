/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * weather
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ The true sign of intelligence is not knowledge but imagination. ]
 * [                                             - Albert Einstein - ]
 */


var utils = require('./utils.js');

(function () {

    var weatherProc,

        svgTemplate = null;

    //
    //
    //
    function loadSvgTemplate(svgFilename) {

        return utils.readTextFileEx(svgFilename)
            .then(function (svgTemplate) {
                svgTemplate = svgTemplate;
            });

    }


    weatherProc = function () {

    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Expose `weatherProc`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = weatherProc;
    }

}());
