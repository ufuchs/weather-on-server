/*jslint node:true*/

'use strict';

module.exports = {

    locales: {
        locales: ['en', 'de', 'ru', 'tr', 'cs', 'pl']
    },

    iso3166ToLocale: {
        "CZ" : "cs",
        "DE" : "de",
        "EN" : "en",
        "PL" : "pl",
        "RU" : "ru",
        "TR" : "tr"
    },

    weatherPool : {
        dir : './weather',
        fileNames : {
            weatherSvg : 'weather.svg',
            unweatherPng : 'unweather.png',
            weatherPng : 'weather.png'
        }
    },

    svgPool : {
        dir : './svg',
        commons : [ 'common.js', 'icons.svg' ],
        devices : {
            kindle4nt : '600x800.svg',
            df3120 : '320x240.svg'
        }
    },

    cmd : {
        pngcrush : 'pngcrush -c 0 {{inPng}} {{outPng}}',
        phantomjs : 'phantomjs {{script}} {{inSvg}} {{outPng}} 1.0'
    }

};
