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

var mongoose = require('mongoose.js');

(function () {

    'use strict';

    var storageDAO;

    /************************************
        StorageDAO
    ************************************/

    function StorageDAO(db) {
        this.db = db;
    }

    StorageDAO.prototype.save = function (json) {
        return null;
    };

    storageDAO = function () {
        return new StorageDAO();
    };

    /**
     * Expose `storageDAO`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = storageDAO;
    }

}());
