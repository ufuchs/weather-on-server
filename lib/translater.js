/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * i18nCb
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */


(function (undefined) {

    var translater,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),


        template = {

            cssFile : null,

            common : {
                tempUnit : null,
                tempUnitToDisplay : null,
                min : null,
                max : null
            },

            header : {
                today : null,
                date : null,
                doy : null
            },

            sun : {
                sr : null,
                ss : null,
                dayLenght : null,
                dayLenghtDiff : null
            },

            weekdays : {
                tomorrow : null,
                day_after_tomorrow : null,
                day_after_tomorrow_plusOne : null
            },

            footer : null
        };

    function Translater(config) {
        this.i18n = config.i18n;
        this.localesMap = config.localesMap;
    }

    function makeTranslater(config) {
        return new Translater(config);
    }

    translater = function (i18n, localesMap) {
        return makeTranslater({
            i18n : i18n,
            localesMap : localesMap
        });

    };



    /************************************
        Exposing Moment
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = translater;
    }

}).call(this);