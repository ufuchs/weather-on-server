/*jslint node: true */
/*jslint todo: true */

'use strict';

var fs = require('fs'),
    mkdirp = require('mkdirp');

//
//
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
exports.mkdirs = function (dirs, mode, cb) {

    (function next(e) {

        if (e === null && dirs.length > 0) {
            mkdirp(dirs.shift(), mode, next);
        } else {
            cb(e);
        }

    }(null));

};

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
