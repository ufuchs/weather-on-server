/*jslint node: true */
/*jslint todo: true */

'use strict';

module.exports.location = {
    id: 1,
    lon: ["13.4542", "13° 27"],
    lat: ["52.5158", "52° 31'"],
    name: "Germany/Berlin",
    lang: "ru",
    device: "kindle4nt",
    period: 0

};

module.exports.wfo = {
    location : {
        id: 1,
        lon: ["13.4542", "13° 27"],
        lat: ["52.5158", "52° 31'"],
        name: "Germany/Berlin",
        lang: "ru",
        device: "kindle4nt",
        period: 0

    },
    weather : {},
    json : null,
    localized : {
        common : {},
        header : {
            date : null,
            doy : null,
            sun : {},
            forecast : {}
        },
        forecastday : []
    }
};

module.exports.createWfo = function () {

    return {
        location : {
            id: 1,
            lon: ["13.4542", "13° 27"],
            lat: ["52.5158", "52° 31'"],
            name: "Germany/Berlin",
            lang: "ru",
            device: "kindle4nt",
            period: 0

        },
        weather : {},
        json : null,
        localized : {
            common : {},
            header : {
                date : null,
                doy : null,
                sun : {},
                forecast : {}
            },
            forecastday : []
        }
    };

};
