/*jslint node:true*/

'use strict';

var locations = {

    locations: [
        {
            id: 1,
            name: "Germany/Berlin",
            lang: "ru"
        },
        {
            id: 2,
            name: "Germany/Bad Elster",
            lang: "de"
        },
        {
            id: 3,
            name: "Denmark/Copenhagen",
            lang: "dk"
        }

    ]

};

module.exports = locations;

locations.getLocationById = function (id) {

    var i,
        loc,
        locs = locations.locations;

    for (i = 0; i < locs.length; i += 1) {

        loc = locs[i];

        if (loc.id === id) {

            return {
                id: loc.id,
                name: loc.name,
                lang: loc.lang.toLowerCase()
            };
        }

    }

    return null;

};

