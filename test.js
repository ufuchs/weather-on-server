var _ = require('lodash'),
    interpol = require('./lib/sunJS/meeus/interpol.js');

//
// interpolLinear
//
interpolLinear = function (values, n) {

    // values[1] is expected to be the max or the min value in the sequence
    if (!(values[0] < values[1] && values[1] < values[2]) ||
        !(values[0] > values[1] && values[1] > values[2])) {
        return undefined;
    }

    var y2 = values[1],
        a = y2 - values[0],
        b = values[2] - y2,
        c = b - a;

    return y2 + (n / 2.0) * (a + b + n * c);
};

var valLinear = [0.884226, 0.877366, 0.870531],
//    valExt = [1.3814294, 1.3812213, 1.3812453],

    // valExt = [
    //     0.983287535443719,
    //     0.9832868012896175,
    //     0.9832911821850825],

    // valExt = [
    //     0.983 287 535 443719,       // 3.Jan

    //     0.983 286 476 2995466       // ym

    //     0.983 286 801 2896175,      // 4.Jan
    //     0.983 291 182 1850825],     // 5.Jan

    valExt = [10, 9, 8];


    // valZero = [0.7233801496991594 * 3600, 0.33460254453961974 * 3600, -0.05447278957535926 * 3600],
    // valZero = [0.33460254453961974, -0.05447278957535926, -0.44375144492490665],
    // valZero = [179.22799409448984 - 180, 180.12567638436323 - 180, 181.02387142741748 - 180],

    // x = prepare(valLinear),
    // y = interpolLinear(x, 4.35/24);

    // x = prepare(valExt),
    // y = interpolExtremum(prepare([5, 6, 7]));

    // console.log(interpol.extremum([0.9, 0.3, 0.1]));
    // console.log(interpol.extremum([0.1, 0.3, 0.2]));

    // console.log(interpol.zero([0.9, 0.3, -0.1], 0));
    // console.log(interpol.zero([-0.1, 0.3, 0.9], 0));
    // console.log(interpol.zero([0.1, 0.3, 0.9], 0));
    // console.log(interpol.zero([0.9, 0.3, 0.1], 0));

    console.log(interpol.zero([-0.2, 0.3, 0.1], 0));





