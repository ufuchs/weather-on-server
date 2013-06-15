
var svgDocument = null,
    svgRoot = null;

//
// Hides the `sun-group` in case of 'sun-rise' 
//  - is empty
//  - is null 
//  - '{{sr}}' (default value)
//
function hideSunGroup() {
    'use strict';
    var sunRise = svgDocument.getElementById('sun-rise'),
        sunGroup,
        value = sunRise.textContent,
        placeHolder = "\\{\\{sr\\}\\}";

    if (value === 'null' || value === '' || value === placeHolder) {
        sunGroup = svgDocument.getElementById('sun-group');
        sunGroup.setAttributeNS(null, 'visibility', 'hidden');
    }

}

//
//
//
function init(evt) {
    'use strict';
    svgDocument = evt.target.ownerDocument;
    svgRoot = svgDocument.documentElement;
    hideSunGroup();
}

