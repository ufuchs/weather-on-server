/*jslint node: true */
/*jslint todo: true */

'use strict';

var wundergroundAstro = require('./lib/provider/wundergroundAstro.js'),
    demoWeather = require('./test/2013-03-29.json'),
    wgA = wundergroundAstro(),
    location = {
        "id": 1,
        "name": "Germany/Berlin",
        "language": "de"
    };


wgA.update(demoWeather);

console.log('[getOwnPropertyNames]');
console.log(Object.getOwnPropertyNames(wgA));


console.log('[property chain]');

    for (var i in wgA) {

        if(wgA.hasOwnProperty(i)) {
            console.log('\townProperty : ' + i);    
        } else {
            console.log('\tinheritedProperty : ' + i);    
        }

        
    }



console.log(wgA.sun(demoWeather));

/*
wgR.get(location, function (data) {
    console.log('X');
});
*/



