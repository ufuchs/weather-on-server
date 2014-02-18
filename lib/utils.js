/*jslint node: true */
/*jslint todo: true */

'use strict';

/*!
 * utils
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person reveals his character by nothing so clearly as the joke ]
 * [ he resents..                            - Georg C. Lichtenberg - ]
 */

var FS = require('fs'),
    moment = require('moment'),
    Q = require('q');

//
// @copyright Vincent Schoettke
//

exports.fillTemplates = function (str, data) {

    function getKeyProp(obj, keyArray) {

        if (!keyArray.length) {
            return obj;
        }

        if ((obj === undefined) || !obj.hasOwnProperty(keyArray[0])) {
            return;
        }

        return getKeyProp(obj[keyArray[0]], keyArray.slice(1));
    }

    return str.replace(/\{\{([\w.]+)\}\}/g, function (match, key) {
        var value = getKeyProp(data, key.split('.'));
        if (value !== undefined) {
            return value;
        }
        return "{{" + key + "}}";
    });

};

//
// tests only
//
exports.readTextFile = function (filename, callback) {

    FS.exists(filename, function (exists) {

        if (exists) {

            FS.readFile(filename, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }
                callback(data);
            });

        }

    });

};

//
//
//
exports.readTextFileW = function (filename) {

    var d = Q.defer();

    FS.exists(filename, function (exists) {

        if (exists) {

            FS.readFile(filename, "utf8", function (err, data) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(data);
                }
            });

        }

    });

    return d.promise;

};

// @param {cfg} Object
// @return Object
//
// @api private

exports.mkdirW = function (dirname) {

    var d = Q.defer();

    FS.exists(dirname, function (exists) {

        if (exists) {
            d.resolve(dirname);
        } else {
            FS.mkdir(dirname, function (err) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(dirname);
                }
            });
        }

    });

    return d.promise;

};

//
//
//
exports.moment_applyPatch_de = function () {

    var defLang = moment.lang();

    moment().lang('de');

    // The original `_monthsShort` doesn't conforms with the German 'DUDEN'.
    //
    // @see http://www.duden.de/suchen/dudenonline/Monat
    //
    // And 'moment().lang('de')._monthsShort' doesn't works.
    moment().lang()._monthsShort =
        "Jan._Febr._März_Apr._Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.".split("_");

    moment().lang(defLang);

};

exports.createWfo = function (config) {

    return {
        cfg : {
            svgTemplate : null,
            request : config.request,
            display : null
        },
        json : config.json,
        weather : {},
        svg : [],
        localized : {
            common : {},
            forecast : [],
            observationFrom : null,
            svg : []
        }

    };

};

exports.extend = function (a, b) {
    var i;

    for (i in b) {
        if (b.hasOwnProperty(i)) {
            a[i] = b[i];
        }
    }

    if (b.hasOwnProperty("toString")) {
        a.toString = b.toString;
    }

    if (b.hasOwnProperty("valueOf")) {
        a.valueOf = b.valueOf;
    }

    return a;
};
