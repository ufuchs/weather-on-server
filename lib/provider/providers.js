/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * providers
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

exports = module.exports = new AstroProvider;

exports.AstroProvider = AstroProvider;

/** 
 * Initialize a new `AstroProvider`.
 *
 * @api public
 */

function AstroProvider() {}

/** 
 * @api public
 */

AstroProvider.prototype = {

    update : function (param) {
        throw new Error('AstroProvider#update needs to be overridden.');
    },

    sun : function (param) {
        throw new Error('AstroProvider#sun needs to be overridden.');
    }

};

///////////////////////////////////////////////////////////////////////////////

exports.WeatherProvider = WeatherProvider;

function WeatherProvider() {}


///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////

exports.WeatherRequest = WeatherRequest;

function WeatherRequest() {

    var ttl = 0;

    function setTTL(time) {
        ttl = time;
    }

    function getTTL() {
        return ttl;
    }

}

WeatherRequest.prototype = {

        // submit
    get : function (location, cb) {
        throw new Error('WeatherRequest#get needs to be overridden.');
    },

    setTTL : function (time) {
        console.log('Here');
        setTTL(time);
        return this;
    }

};

///////////////////////////////////////////////////////////////////////////////


function WeatherEngine(astroProvider) {
    this.astroProvider = astroProvider;
}
