/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * provider
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */


function WeatherProvider() {}

//
//
//
WeatherProvider.prototype.serviceUrl = function () {
    throw new Error('`serviceUrl` needs to be overridden.');
};


 /**
 * Expose `WeatherProvider`.
 */

exports = module.exports = WeatherProvider;


