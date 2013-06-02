
var SVGDocument = null,
    SVGRoot = null;

//
// Hides the `sun-group` in case of 'sun-rise' 
//  - is empty
//  - is null 
//  - '{{sr}}' (default value)
//
function HideSunGroup() {

    var sunRise = SVGDocument.getElementById('sun-rise'),
        sunGroup = SVGDocument.getElementById('sun-group'),
        value = sunRise.textContent,
        placeHolder = '\{\{sr\}\}';

    if (value === 'null' || value === '' || value === placeHolder ) {
        sunGroup.setAttributeNS(null, 'visibility', 'hidden');
    }

}

//
//
//
function Init(evt) {
    SVGDocument = evt.target.ownerDocument;
    SVGRoot = SVGDocument.documentElement;
    HideSunGroup();
}

