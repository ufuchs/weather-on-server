/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

'use strict';

var when = require('when');

function wrapper(arg) {
    return when(function () {
        return arg;
    });
}

var ar = [];

ar.push(wrapper(1));
//ar.push(wrapper(2));
//ar.push(wrapper('three'));


/*
while (ar.length){
    var fn = ar.shift();
    console.log("calling ", fn);
    fn();
}
*/

when.all(ar)
    .then(function(p) {
        var x = p;
        // sollte '[0, 1, 2]' zurück geben
        console.log(x);
    });

