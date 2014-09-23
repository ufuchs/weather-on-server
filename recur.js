/*jslint node: true */
/*jslint todo: true */
/*jslint nomen: true */

var facturial = function facturial (i, a) {

    a = a || 1;

    if (i < 2) {
        return a;
    };

    return facturial(i - 1, a * i);
};

console.log(facturial(3 ));
