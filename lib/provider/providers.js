/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * providers
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

//exports = module.exports = new AstroProvider;

exports.AstroProvider = AstroProvider;

/** 
 * Initialize a new `AstroProvider`.
 *
 * @api public
 */

function AstroProvider() {
    console.log("invoked: ctor 'AstroProvider'");
}

/** 
 * @api public
 */

AstroProvider.prototype.update = function (param) {
    throw new Error('AstroProvider#update needs to be overridden.');
};

AstroProvider.prototype.sun = function (param) {
    throw new Error('AstroProvider#sun needs to be overridden.');
};

///////////////////////////////////////////////////////////////////////////////

exports.WeatherProvider = WeatherProvider;

function WeatherProvider() {
    console.log("invoked: ctor 'WeatherProvider'");
    this.astroProvider = null;
}

WeatherProvider.prototype.extractWeatherFromProviderData = function (weather, cb) {
    throw new Error('WeatherProvider#extractWeatherFromProviderData needs to be overridden.');
};

WeatherProvider.prototype.getAstroProvider = function () {
    console.log("invoked: WeatherProvider#getAstroProvider");
    return this.astroProvider;
};

WeatherProvider.prototype.setAstroProvider = function (astroProvider) {
    console.log("invoked: WeatherProvider#setAstroProvider");
    this.astroProvider = astroProvider;
};

///////////////////////////////////////////////////////////////////////////////

exports.WeatherEngine = WeatherEngine;

function WeatherEngine(astroProvider, weatherProvider) {
    console.log("invoked: ctor 'WeatherEngine'");
    this.astroProvider = astroProvider;
    this.weatherProvider = weatherProvider;
    this.weatherProvider.setAstroProvider(astroProvider);
}

WeatherEngine.prototype.extractWeatherFromProviderData = function (weather, cb) {
    this.weatherProvider.extractWeatherFromProviderData(this, weather, cb);
};

WeatherEngine.prototype.getAstroProvider = function () {
    return this.astroProvider;
};

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


