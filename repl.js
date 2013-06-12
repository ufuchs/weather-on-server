/*jslint node: true */
/*jslint todo: true */

'use strict';


var fs = require('fs.extra'),
    path = require('path'),
    request = require('request'),

    moment = require('moment'),

    localizer = require('./lib/localizer.js'),

    CFG = require('./app-config.js'),

    I18n = require('i18n-2'),
    i18n = new I18n(CFG.locales),

    utils = require('./lib/utils.js'),

    provider = require('./provider/wunderGround/index.js'),

    demoWeather = require('./test/2013-03-29.json'),

    renderService = require('./lib/svg2png-renderer.js'),

    filenames = require('./lib/filenames.js'),

    fn,

    params = { id : 1, device : 'kindle4nt', lang : 'ru' },

    locations = require('./locations.json').locations;


fn = filenames(CFG);

fn.getFilenames(params, function (filenames) {
    console.log(filenames);
});