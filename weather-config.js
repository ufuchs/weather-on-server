/*jslint node:true*/

'use strict';

module.exports = {

    provider : {
        downloader : require('./lib/downloader.js'),
        query : require('./lib/provider/wunderground/query.js'),
        extractor : require('./lib/provider/wunderground/extractor.js')
    },

    production : {

        dir : './public/weather',

        files : {

            names : {
                weatherPng : 'weather.png'
            },

            quantity : {
                kindle4nt : 1,
                df3120 : 4
            }

        },

        /* expire time in seconds of the output files*/
        expires : 3600

    },

    templatesPool : {
        dir : './templates',
        devices : {
            kindle4nt : '600x800.svg',
            df3120 : '320x240.svg'
        }
    }

};
