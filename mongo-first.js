/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var mongo = require('mongodb').MongoClient,
    Q = require('q'),
    demoWeather = require('./lib/provider/wunderground-2013-03-29.json'),
    format = require('util').format;

var use = function (schema) {
    var d = Q.defer();
    mongo.connect('mongodb://127.0.0.1:27017/' + schema, function (err, db) {
        if (err) {
            d.reject(err);
        } else {
            d.resolve(db);
        }
    });
    return d.promise;
};

var collection = function (db, coll) {
    return db.collection(coll);
};

var insert = function (coll, doc) {
    var d = Q.defer();

    coll.insert(doc, function (err, docs) {
        if (err) {
            d.reject(err);
        } else {
            d.resolve(docs);
        }
    });
    return d.promise;
};

mongo.connect('mongodb://127.0.0.1:27017/abc', function (err, db) {

    if (err) {
        throw err;
    }

    var collection = db.collection('test_insert');

    collection.insert({date : 'abababa', weather : demoWeather}, function (err, docs) {

        // Locate all the entries using find
        collection.find().toArray(function (err, results) {
            console.dir(results);
        });

        collection.count(function (err, count) {
            console.log(format("count = %s", count));
            // Let's close the db
            console.log('docs', docs)
            db.close();
        });

    });

});
