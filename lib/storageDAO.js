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

    var storageDAO,
        collName = 'daily';

    /************************************
        StorageDAO
    ************************************/

    function StorageDAO(connString) {
        this.connString = connString;
    }

    StorageDAO.prototype.save = function (weather) {

        return Q.nfcall(mongo.connect, 'mongodb://127.0.0.1:27017/weather').then(function (db) {

            var collection = db.collection(collName);

            console.log("Connected");

            return Q.ninvoke(collection, "insert", weather)
                .then(function () {
                    console.log("Finished adding");
                }).finally(function (err) {
                    console.log("closing db", err);
                    db.close();
                });

        }).fail(function (err) {
            console.log(err);
        }).done(function () {
            console.log("ALL COMPLETE");
        });

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
