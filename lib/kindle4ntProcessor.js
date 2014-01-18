/*jslint node: true */
/*jslint todo: true */

'use strict';

var when = require('when'),
    Bunyan = require('bunyan'),
    l = new Bunyan({ 'name': 'weatherProcessor', 'level': 'info' }),
    localizer = require('./kindle4ntLocalizer.js'),
    svg2png = require('./svg2png/svg2png.js'),
    utils = require('./utils.js');

(function () {

    var kindle4ntProcessor;

    //
    //
    //
    function populateSvgTemplate(wfo) {

        var l = wfo.localized;

        wfo.svg = utils.fillTemplates(l.svgTemplate, {

            // common
            tempUnit : l.common.tempUnitToDisplay,
            min : l.common.min,
            max : l.common.max,

            // header
            date : l.header.date,
            doy : l.header.doy,

            // header/sun
            sr : l.header.forecast.sun.sr,
            ss : l.header.forecast.sun.ss,
            dl : l.header.forecast.sun.dl + '   ' + l.header.forecast.sun.dld,

            // header/forecast
            dow0 : l.header.forecast.name,
            h0 : l.header.forecast.temp.high,
            l0: l.header.forecast.temp.low,
            ic0 : l.header.forecast.ic,

            // tomorrow
            dow1 : l.forecastday[0].name,
            h1 : l.forecastday[0].temp.high,
            l1 : l.forecastday[0].temp.low,
            ic1 : l.forecastday[0].ic,

            // day after tomorrow
            dow2 : l.forecastday[1].name,
            h2 : l.forecastday[1].temp.high,
            l2 : l.forecastday[1].temp.low,
            ic2 : l.forecastday[1].ic,

            // // day after tommorow + 1
            dow3 : l.forecastday[2].name,
            h3 : l.forecastday[2].temp.high,
            l3 : l.forecastday[2].temp.low,
            ic3 : l.forecastday[2].ic,

            // footer
            update : l.footer

        });

        return wfo;

    }

    ////////////////////////////////////////////////////////////////////////////

    //
    //
    //
    kindle4ntProcessor = function (locales) {
        localizer(locales);
    };

    //
    //
    //
    kindle4ntProcessor.process_local = function (wfo, dayNum) {

        var d = when.defer(),
            l = wfo.localized,
            c = wfo.cfg;

        l.svgTemplate = utils.fillTemplates(c.svgTemplate.substr(0, c.svgTemplate.length + 1), {
            css : c.filenames.svg.cssFile
        });

        localizer.localize(wfo, dayNum)
            .then(populateSvgTemplate)
            .then(function (wfo) {
                d.resolve(svg2png.renderSvgFromStream(
                    wfo.svg,
                    wfo.cfg.filenames.png.weatherPng
                ));
            });

        return d.promise;

    };

    //
    //
    //
    kindle4ntProcessor.process = function (wfo, isoLang) {

        var files = [],
            d = when.defer();

        localizer.prepare(wfo, isoLang);

        kindle4ntProcessor.process_local(wfo)
            .then(function (filename) {
                files.push(filename);
                d.resolve(files);
            }, function (err) {
                d.reject(err);
            });

        return d.promise;

    };

    ////////////////////////////////////////////////////////////////////////////

    /**
     * Expose `weatherProcessor`.
     */

    // CommonJS module is defined
    if (module !== 'undefined' && module.exports) {
        module.exports = kindle4ntProcessor;
    }

}());
