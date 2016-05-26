import { max, min, mean } from 'd3-array';
import slidingWindow from './slidingWindow';
import { includeMap, rebindAll } from 'd3fc-rebind';

export default function() {

    let closeValue = (d, i) => d.close;
    let highValue = (d, i) => d.high;
    let lowValue = (d, i) => d.low;

    const kWindow = slidingWindow()
        .period(5)
        .defined(d => closeValue(d) != null && highValue(d) != null && lowValue(d) != null)
        .accumulator(values => {
            let kValue, minLow, maxHigh;
            if (values) {
                maxHigh = max(values, highValue);
                minLow = min(values, lowValue);
                kValue = 100 * (closeValue(values[values.length - 1]) - minLow) / (maxHigh - minLow);
            }
            return kValue;
        });

    const dWindow = slidingWindow()
        .period(3)
        .accumulator(values => {
            let dValue;
            if (values && values.every(d => d)) {
                dValue = mean(values);
            }
            return dValue;
        });

    const stochastic = data => {
        const kValues = kWindow(data);
        const dValues = dWindow(kValues);
        return kValues.map((k, i) => ({ k: k, d: dValues[i] }));
    };

    stochastic.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return stochastic;
    };
    stochastic.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = args[0];
        return stochastic;
    };
    stochastic.lowValue = (...args) => {
        if (!args.length) {
            return lowValue;
        }
        lowValue = args[0];
        return stochastic;
    };

    rebindAll(stochastic, kWindow, includeMap({'period': 'kPeriod'}));
    rebindAll(stochastic, dWindow, includeMap({'period': 'dPeriod'}));

    return stochastic;
}
