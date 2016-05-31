import { mean, deviation } from 'd3-array';
import { rebind } from 'd3fc-rebind';
import _slidingWindow from './slidingWindow';

export default function() {

    let multiplier = 2;

    const slidingWindow = _slidingWindow()
        .accumulator(values => {
            let upper, lower, avg;
            if (values) {
                const stdDev = deviation(values);
                avg = mean(values);
                upper = avg + multiplier * stdDev;
                lower = avg - multiplier * stdDev;
            }
            return {
                upper: upper,
                average: avg,
                lower: lower
            };
        });

    const bollingerBands = data => slidingWindow(data);

    bollingerBands.multiplier = (...args) => {
        if (!args.length) {
            return multiplier;
        }
        multiplier = args[0];
        return bollingerBands;
    };

    rebind(bollingerBands, slidingWindow, 'period', 'value');

    return bollingerBands;
}
