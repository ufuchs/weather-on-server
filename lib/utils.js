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

function getPropWithArray(obj, keyNameArray) {

    if (!keyNameArray.length) {
        return obj;
    }

    if ((obj === undefined) || !obj.hasOwnProperty(keyNameArray[0])) {
        return;
    }

    return getPropWithArray(obj[keyNameArray[0]], keyNameArray.slice(1));
}

function getProp(obj, keyString) {
    return getPropWithArray(obj, keyString.split('.'));
}

exports.fillTemplates = function (str, data) {
    return str.replace(/\{\{([\w.]+)\}\}/g, function (match, key) {
        var value = getProp(data, key);
        if (value !== undefined) {
            return value;
        }
        return "{{" + key + "}}";
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

//
//
//
exports.numberedFilename = function (aFilename, num) {

    var filename = 'abc-U.txt'.split('.'),
        len = filename[0].length,
        normalizedFname = (filename[0].charAt(len - 2) === '-'
            ? filename[0].substr(0, len - 2)
            : filename[0] + '~')
            + '-' + num + '.' + filename[1];

    return normalizedFname;

};

exports.createWfo = function (request) {

    return {
        cfg : {
            svgTemplate : null,
            request : request,
            display : null
        },
        json : null,
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
