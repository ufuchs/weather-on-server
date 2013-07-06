/*jslint node:true*/

'use strict';

module.exports = {

    cmd : {
        pngcrush : 'pngcrush -c 0 {{inPng}} {{outPng}}',
        phantomjs : 'phantomjs {{script}} {{inSvg}} {{outPng}} 1.0'
    }

};


