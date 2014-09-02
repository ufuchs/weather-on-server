prepare = function(values) {

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    return {
        a : a,
        b : b,
        c : c,
        y2 : y2
    };

};

//
// interpolLinear
//
interpolLinear = function (p, n) {
    return p.y2 + (n / 2.0) * (p.a + p.b + n * p.c);
};

//
// interpolExtremum
//
interpolExtremum = function (p) {
    return {
        ym : p.y2 - (p.a*p.a + 2*p.a*p.b + p.b*p.b) / (8*p.c),
        nm : - ((p.a + p.b) / (2*p.c))
    };
};

//
// interpolZero
//
interpolZero = function (p, n0) {
    return (-2 * p.y2) / (p.a + p.b + p.c * n0);
};

var valLinear = [0.884226, 0.877366, 0.870531],
    valExt = [1.3814294, 1.3812213, 1.3812453],
    // valZero = [0.7233801496991594 * 3600, 0.33460254453961974 * 3600, -0.05447278957535926 * 3600],
    // valZero = [0.33460254453961974, -0.05447278957535926, -0.44375144492490665],
    valZero = [179.22799409448984 - 180, 180.12567638436323 - 180, 181.02387142741748 - 180],

    // x = prepare(valLinear),
    // y = interpolLinear(x, 4.35/24);

    // x = prepare(valExt),
    // y = interpolExtremum(x);

    x = prepare(valZero),
    y = interpolZero(x, 0);

console.log(y);
y = interpolZero(x, y);
console.log(y);
y = interpolZero(x, y);
console.log(y);
y = interpolZero(x, y);
console.log(y);
y = interpolZero(x, y);
console.log(y);
y = interpolZero(x, y);
console.log(y);
y = interpolZero(x, y);
console.log(y);

//console.log(y);

