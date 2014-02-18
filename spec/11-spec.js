/*jslint node: true */
/*jslint todo: true */

'use strict';

var storageDAO = require('../lib/storageDAO.js'),
    utils = require('../lib/utils.js'),
    Q = require('q');


describe("localizer", function () {

    var weather,
        connString = 'mongodb://127.0.0.1:27017/weather',
        dao = storageDAO(connString);



    it("loadWeather", function () {

        var ready;

        runs(function () {
            ready = false;
            utils.readTextFile('spec/wunderground-2013-03-29.json', function (data) {
                weather = JSON.parse(data);
                ready = true;
            });

        });

        waitsFor(function() {
            return ready;
        }, "'loadWeather' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });

    });

    it("saveWeather", function () {

        var ready;

        runs(function () {
            Q.when(dao.save(weather))
                .then(function () {
                    ready = true;
                });

        });

        waitsFor(function() {
            return ready;
        }, "'saveWeather' timed out", 2000);

        runs(function() {
            expect(ready).toEqual(true);
        });

    });

});



