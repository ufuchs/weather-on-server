/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

/*!
 * s3
 * Copyright(c) 2014 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ A person who won't read has no advantage over one who can't read. ]
 * [                                                     - Mark Twain -]
 */

var mongo = require('mongodb').MongoClient,
    Q = require('q');

(function () {

    'use strict';

    var storageDAO;

    /************************************
        StorageDAO
    ************************************/

    function StorageDAO(connString) {
        this.connString = connString;
    }

    StorageDAO.prototype.save = function (weather) {

        var coll = 'weather';

        function use(connString) {
            var d = Q.defer();
            mongo.connect(connString, function (err, db) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(db);
                }
            });
            return d.promise;
        }

        function collection(db) {
            return {
                coll : db.collection(coll),
                weather : weather
            };
        }

        function insert(config) {
            var d = Q.defer();

            coll.insert(config.weather, function (err, docs) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(docs);
                }
            });

            return d.promise;

        }

        return Q.when(use(this.connString))
            .then(collection)
            .then(insert);

    };

    storageDAO = function (connString) {
        return new StorageDAO(connString);
    };

    /**
     * Expose `storageDAO`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = storageDAO;
    }

}());
