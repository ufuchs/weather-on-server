/*jslint node:true*/

'use strict';

var path = require('path'),

    ds = process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development'
        ? 'byTestData'
        : 'byProvider',

    appCfg = {

        weatherSource : ds,

        aws : {
            key: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            bucket: process.env.AWS_BUCKET_SLEEPYFOX
        },

        devices : {
            kindle4nt : {
                resolution : '600x800',
                singleDayDisplay : false,
                crushed : true,
                maxForecastDays : 4
            },
            df3120 : {
                resolution : '320x240',
                singleDayDisplay : true,
                crushed : true,
                maxForecastDays : 3
            }
        },

        production : {

            dir : './public/weather',

            files : {

                names : {
                    weatherPng : 'weather'
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
            dir : './templates'
        }

    };

module.exports = appCfg;

//
//
//
appCfg.getDisplay = function (device) {
    return {
        device : device,   // not really needed
        resolution : appCfg.devices[device].resolution,
        singleDayDisplay : appCfg.devices[device].singleDayDisplay,
        crushed : appCfg.devices[device].crushed,
        maxForecastDays : appCfg.devices[device].maxForecastDays
    };
};

//
//
//
appCfg.getProductionDir = function () {
    return path.resolve(appCfg.production.dir);
};

//
//
//
appCfg.getSvgTemplate = function (device) {
    return path.join(path.resolve(appCfg.templatesPool.dir),
        appCfg.devices[device].resolution + '.svg');
};

//
//
//
appCfg.getDeviceDir = function (device) {
    return path.join(path.resolve(appCfg.production.dir), device);
};

//
//
//
appCfg.getTargetDir = function (device, location) {
    return path.join(appCfg.getDeviceDir(device), location);
};

//
//
//
appCfg.getPngFilename = function () {
    return appCfg.production.files.names.weatherPng;
};

