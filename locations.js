/*jslint node:true*/

'use strict';

var locations = {

    locations: [
        {
            id: 1,
            lon: ["13.4542", "13° 27"],
            lat: ["52.5158", "52° 31'"],
            name: "Germany/Berlin",
            lang: "ru"
        },
        {
            id: 2,
            lon: ["12.2394", "12° 14'"],
            lat: ["50.2807", "50° 17'"],
            name: "Germany/Bad Elster",
            lang: "de"
        },
        {
            id: 3,
            lon: ["12.5683", "12° 34'"],
            lat: ["55.6761", "55° 40'"],
            name: "Denmark/Copenhagen",
            lang: "dk"
        }

    ]

};

module.exports = locations;

//
//
//
exports.getLocationById = function (locations, id) {

    var i,
        loc;

    for (i = 0; i < locations.length; i += 1) {

        loc = locations[i];

        if (loc.id === id) {

            return {
                id: loc.id,
                lon: loc.lon,
                lat: loc.lat,
                name: loc.name,
                lang: loc.lang
            };
        }

    }

    return null;

};
