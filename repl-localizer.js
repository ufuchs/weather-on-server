/*jslint node: true */
/*jslint todo: true */

'use strict';

var localizer = require('./lib/localizer.js'),
    tr,
    I18n = require('i18n-2'),
    i18n = new I18n({locales: ['en', 'de', 'ru', 'tr', 'cs', 'pl']}),
    demoWeather = require('./test/2013-03-29.json'),
    CFG = require('./app-config.js'),
    params = { id : 1, device : 'kindle4nt', lang : 'de' };



tr = localizer(i18n, CFG.iso3166ToLocale);

tr.localize(demoWeather, params, function (result) {
    console.log(result);
});

