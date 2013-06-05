/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * i18n
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 */

/**
 * Dependencies
 */

var CFG = require('./../app-config.js'),
    utils = require('./utils.js'),
    I18n2 = require('i18n-2');

/** 
 * Initialize a new `I18n`.
 *
 * @api public
 */

function I18n() {
    this.i18n = new I18n2(CFG.locales);
}


