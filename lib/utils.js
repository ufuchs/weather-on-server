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

var fs = require('fs'),
//    mkdirp = require('mkdirp'),
    reader = require("buffered-reader"),
    DataReader = reader.DataReader;

//
// @copyright Vincent Schoettke
//
exports.fillTemplates = function (str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, function (match, key) {
        if (data.hasOwnProperty(key)) {
            return data[key];
        }
        return "{{" + key + "}}";
    });
};

//
// @see : http://stackoverflow.com/questions/5308514/prescriptive-nodejs
//
/*
exports.mkdirs = function (dirs, mode, cb) {

    (function next(e) {

        if (e === null && dirs.length > 0) {
            mkdirp(dirs.shift(), mode, next);
        } else {
            cb(e);
        }

    }(null));

};
*/

//
//
//
exports.readTextFile = function (filename, callback) {

    fs.exists(filename, function (exists) {

        if (exists) {

            fs.readFile(filename, "utf8", function (err, data) {
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
exports.readTextToArray = function (file, cb) {

    var lines = [];

    new DataReader(file, { encoding: "utf8" })

        .on("error", function (error) {
            cb(error, null);
        })

        .on("line", function (line) {
            lines.push(line);
        })

        .on("end", function () {
            cb(null, lines);
        })

        .read();
};

