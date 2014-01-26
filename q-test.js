/*jslint node: true */
/*jslint todo: true */

'use strict';

var q = require('q');

function A() {}

A.prototype =  {

    echo : function () {
        console.log('proto echo');
    }

};


function makeA() {
    return new A();
}

var a = makeA();

a.echo = function () {
    console.log('echo');
};


a.prototype.echo();
