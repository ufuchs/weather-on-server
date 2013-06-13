/*jslint node: true */
/*jslint todo: true */

'use strict';

var a, b;

function A() {
    console.log("invoked: ctor 'WundergroundAstro'");
    this.a = 1000;
    this.a1 = function () {};
}
A.prototype.setA = function (val) {this.a = val;};
A.prototype.getA = function () {return this.a;};


function B() {
    A.call(this);
    this.b = 1;
    this.b1 = function () {};
}
B.prototype = Object.create(A.prototype);




b = new B();


// b = Object.create(A.prototype);
// b.setA(10);
console.log(b.getA());
// b.b1 = 1;

//console.log(A.prototype);


for (var i in b) {
//    console.log(i);
    if (b.hasOwnProperty(i)) {        console.log(i);    }
}