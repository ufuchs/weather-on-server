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

        var localized = wfo.localized;

        wfo.svg = utils.fillTemplates(localized.svgTemplate, {

            tempUnit : localized.common.tempUnitToDisplay,
            min : localized.common.min,
            max : localized.common.max,

            // header
            date : localized.header.date,
            doy : localized.header.doy,
            dow0 : localized.header.forecast.name,
            // header/sun
            sr : localized.header.sun.sr,
            ss : localized.header.sun.ss,
            dl : localized.header.sun.dl + '   ' + localized.header.sun.dld,
            // header/forecast
            h0 : localized.header.forecast.temp.high,
            l0: localized.header.forecast.temp.low,
            ic0 : localized.header.forecast.ic,

            // tomorrow
            dow1 : localized.forecastday[0].name,
            h1 : localized.forecastday[0].temp.high,
            l1 : localized.forecastday[0].temp.low,
            ic1 : localized.forecastday[0].ic,

            // day after tomorrow
            dow2 : localized.forecastday[1].name,
            h2 : localized.forecastday[1].temp.high,
            l2 : localized.forecastday[1].temp.low,
            ic2 : localized.forecastday[1].ic,

            // // day after tommorow + 1
            dow3 : localized.forecastday[2].name,
            h3 : localized.forecastday[2].temp.high,
            l3 : localized.forecastday[2].temp.low,
            ic3 : localized.forecastday[2].ic,

            // footer
            update : localized.footer

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
    kindle4ntProcessor.process_local = function (wfo) {

        var d = when.defer(),
            l = wfo.localized,
            c = wfo.cfg;

        l.svgTemplate = utils.fillTemplates(c.svgTemplate.substr(0, c.svgTemplate.length + 1), {
            css : c.filenames.svg.cssFile
        });

        localizer.localize(wfo)
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
    kindle4ntProcessor.process = function (wfo) {

        var files = [],
            d = when.defer();

        localizer.prepare(wfo);

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
