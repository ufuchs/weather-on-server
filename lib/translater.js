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

var moment = require('moment'),
    utils = require('./utils.js');

(function (undefined) {

    var translater,

        i18n,

        VERSION = "0.1.0",

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports),


        result = {

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

    //
    //
    //
    function commons(weather, cb) {

        var str;

        str = i18n.__('tempUnit').split('_');

        result.common.tempUnit = str[0];

        result.common.tempUnitToDisplay = str[1];

        result.common.min = i18n.__('minimal');

        result.common.max = i18n.__('maximal');

        cb();

    }

    //
    //
    //
    function header(weather, cb) {

        var today = i18n.__('today'),
            dateFormatStr = utils.fillTemplates(i18n.__('currDate'), {
                day: 'DD',
                month: 'MMM'
            }),
            date,
            doy;

        if ((today === '') || (today === null)) {
            today = moment(weather.date).format('dddd');
        }

        result.header.today = today;

        // 29 Mar
        result.header.date = moment(weather.date).format(dateFormatStr);

        // 88. day of year
        result.header.doy = utils.fillTemplates(i18n.__('dayOfYear'), {
            doy: moment(weather.date).dayOfYear()
        });

        cb(result, weather);
    }


    function Translater(config) {
        i18n = config.i18n;
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

    Translater.prototype = {

        translate : function (weather) {
            commons(weather, function () {
                header(weather, function () {
                    console.log(result);
                });
            });

        }

    };

/*
    Translater.prototype.translate = function () {
        return template;
    };
*/
    /************************************
        Exposing Moment
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = translater;
    }

}).call(this);