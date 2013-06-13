/*jslint node: true */
/*jslint todo: true */

'use strict';

var wundergroundAstro = require('./lib/provider/wundergroundAstro.js'),
    demoWeather = require('./test/2013-03-29.json'),

    astro = wundergroundAstro(null),



    weatherProvider = require('./lib/provider/wunderground.js'),
    provider = weatherProvider(), 
    WeatherEngine = require('./lib/provider/providers.js').WeatherEngine,

    AstroProvider = require('./lib/provider/providers.js').AstroProvider,
    ap = new AstroProvider(),

    we = new WeatherEngine(astro, provider),
    x,
    location = {
        "id": 1,
        "name": "Germany/Berlin",
        "language": "de"
    };


//console.log(Object.getOwnPropertyNames(ap));

/*
for (var i in astro) {
//    if (provider.hasOwnProperty(i))

    console.log(i);
}
*/


we.extractWeatherFromProviderData(demoWeather, function (weather) {
    console.log(weather);
})


