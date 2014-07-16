/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * svgEngine
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ Success is not the key to happiness. Happiness is the key to success. ]
 * [ If you love what you are doing, you will be successful.               ]
 * [                                                 - Albert Schweitzer - ]
 */

var timebase = require('./timebase.js');

(function () {

    'use strict';

    var peng;


    peng = {

        tb : null,

        //
        //
        //
        prepare : function() {
            tb = timebase();
        },


        ////////////////////////////////////////////////////////////////////////
        //  methodes of 'TimeBase'
        ////////////////////////////////////////////////////////////////////////

        //
        //
        //        
        updateTimeBase : function() {
            timeBase().updateTimeBase(0);
        }



    };

    /**
     * Expose `peng`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = peng;
    }

}());

       
