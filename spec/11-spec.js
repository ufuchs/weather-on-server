/*jslint node: true */
/*jslint todo: true */

'use strict';

var wunderground = require('../lib/provider/wunderground.js'),
    utils = require('../lib/utils.js');

var w = wunderground('123');

console.log(w.getApiUri('1', '2'));

//console.log(wunderground.query.fn.getApiUri('ru', 'Berlin'));
