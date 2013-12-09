/*jslint node:true*/

'use strict';

var locales = {};

module.exports.locales = locales;

locales.i18n = {
    locales : ['cs', 'da', 'de', 'en', 'pl', 'ru', 'tr']
};

locales.iso3166ToLocale = {
    "cz" : "cs",
    "dk" : "da"
};

locales.mapIsoToI18n = function (lang) {

    lang = lang.toLowerCase();
    return locales.iso3166ToLocale[lang] || lang;

};
