/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

/*!
 * localizer
 * Copyright(c) 2013 Uli Fuchs <ufuchs@gmx.com>
 * MIT Licensed
 *
 * [ However beautiful the strategy, you should occasionally look at ]
 * [ the results.                              - Winston Churchill - ]
 */

/**
 * Dependencies
 */

var fn   = require('when/function'),
    nodefn = require("when/node/function"),
    when = require('when');

// Examples of Promises/A forwarding.

// A few simple examples to show how the mechanics of Promises/A
// forwarding works.
// These examples are contrived, of course, and in real usage, promise
// chains will typically be spread across several function calls, or
// even several levels of your application architecture.

var

d = when.defer(),

// Resolved promises chain and forward values to next promise
// The first promise, d.promise, will resolve with the value passed
// to d.resolve() below.
// Each call to .then() returns a new promise that will resolve
// with the return value of the previous handler.  This creates a
// promise "pipeline".
y = d.promise
    .then(function(x) {
        // x will be the value passed to d.resolve() below
        // and returns a *new promise* for x + 1
        return x + 1;
    })
    .then(function(x) {
        // x === 2
        // This handler receives the return value of the
        // previous handler.
        return x + 1;
    })
    .then(function(x) {
        // x === 3
        // This handler receives the return value of the
        // previous handler.
        return x + 1;
    })
    .then(function(x) {
        // x === 4
        // This handler receives the return value of the
        // previous handler.
        console.log('resolve ' + x);
    });

d.resolve(1);

console.log(d.promise);

// Rejected promises behave similarly, and also work similarly
// to try/catch:
// When you catch an exception, you must rethrow for it to propagate.
// Similarly, when you handle a rejected promise, to propagate the
// rejection, "rethrow" it by either returning a rejected promise,
// or actually throwing (since when.js translates thrown exceptions
// into rejections)
d = when.defer();

d.promise
    .then(function(x) {
        throw x + 1;
    })
    .then(null, function(x) {
        // Propagate the rejection
        throw x + 1;
    })
    .then(null, function(x) {
        // Can also propagate by returning another rejection
        return when.reject(x + 1);
    })
    .then(null, function(x) {
        console.log('reject ' + x); // 4
    });

d.resolve(1);

// Just like try/catch, you can choose to propagate or not.  Mixing
// resolutions and rejections will still forward handler results
// in a predictable way.
d = when.defer();

d.promise
    .then(function(x) {
        return x + 1;
    })
    .then(function(x) {
        throw x + 1;
    })
    .then(null, function(x) {
        // Handle the rejection, and don't propagate.  This is like
        // catch without a rethrow
        return x + 1;
    })
    .then(function(x) {
        console.log('mixed ' + x); // 4
    });

d.resolve(1);

