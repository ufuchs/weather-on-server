/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * wundergroundAstro
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var AstroProvider = require('./providers').AstroProvider;

(function (undefined) {

    var wundergroundAstro,

        weather,

        // check for nodeJS
        hasModule = (module !== 'undefined' && module.exports);


    function update(aweather) {
        weather = aweather;
    }

    /** 
     * Sets the time to live for the cache.
     *
     * @param {ttl} Integer
     *
     * @api private
     */

    function getSunByEvent(event) {

        var ev,
            hour,
            min;

        switch (event) {

        case 'rise':
            ev = weather.moon_phase.sunrise;
            break;

        case 'set':
            ev = weather.moon_phase.sunset;
            break;

        }

        hour = ev.hour;
        min = ev.minute;

        return hour * 3600 + min * 60;

    }

    /** 
     * Sets the time to live for the cache.
     *
     * @param {ttl} Integer
     *
     * @api private
     */

    function getSun(yesterdaysSun) {

        var rise = getSunByEvent('rise'),
            set = getSunByEvent('set'),
            dayLenght = set - rise,
            dayLenghtDiff;

        if (yesterdaysSun === null || yesterdaysSun === undefined) {
            dayLenghtDiff = 0;
        } else {
            dayLenghtDiff = dayLenght - yesterdaysSun.dayLenght;
        }

        return {
            rise : rise,
            set : set,
            dayLenght : dayLenght,
            dayLenghtDiff : dayLenghtDiff
        };

    }

    ///////////////////////////////////////////////////////////////////////////

    /** 
     *
     * @api private
     */

    function WundergroundAstro(config) {
        console.log("invoked: ctor 'WundergroundAstro'");
        this.x = 0;

        // this overloads the prototyp 'sun' method
        // AND
        // moves it to the own prototype chain
//        this.sun = function (weather) {console.log('[this.sun]'); return 'Denkste!';};
    }

//    WundergroundAstro.sun = function (weather) {console.log('ownSun');};

    /** 
     * 
     * @param {proxy} String
     * @param {apiKey} String 
     * @param {ttl} Integer     
     *
     * @api public
     */

    wundergroundAstro = function () {

        return new WundergroundAstro({});

    };

    ///////////////////////////////////////////////////////////////////////////


    WundergroundAstro.prototype = Object.create(AstroProvider.prototype);

    WundergroundAstro.prototype.update =  function (weather) { update(weather);}

    // this overides the prototyp 'sun' method
    // AND
    // keep it in the prototype chain
    WundergroundAstro.prototype.sun =  function (weather) { console.log('[prototype.sun]'); return getSun(weather);}

/*
    WundergroundAstro.prototype = {

        __proto__ : AstroProvider.prototype,

        sun : function () {
            return getSun(null);
        },


        update : function (weather) {update(weather);}

    };
*/

    /**
     * Expose `wundergroundAstro`.
     */

    // CommonJS module is defined
    if (hasModule) {
        module.exports = wundergroundAstro;
    }

}).call(this);