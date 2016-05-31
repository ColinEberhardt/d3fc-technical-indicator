import { identity, functor } from './fn';
import { mean } from 'd3-array';

export default function() {

    let value = identity;
    let period = () => 9;

    const initialMovingAverageAccumulator = period => {
        const values = [];
        return value => {
            let movingAverage;
            if (values.length < period && value != null) {
                values.push(value);
            }
            if (values.length >= period) {
                movingAverage = mean(values);
            }
            return movingAverage;
        };
    };
    const exponentialMovingAverage = function(data) {
        const size = period.apply(this, arguments);
        const alpha = 2 / (size + 1);
        const initialAccumulator = initialMovingAverageAccumulator(size);
        let previous;
        let initialMovingAverage;

        return data.map((d, i) => {
            const v = value(d, i);
            let ema;
            if (initialMovingAverage === undefined) {
                ema = initialMovingAverage = initialAccumulator(v);
            } else {
                ema = v * alpha + (1 - alpha) * previous;
            }
            previous = ema;
            return ema;
        });
    };

    exponentialMovingAverage.period = (...args) => {
        if (!args.length) {
            return period;
        }
        period = functor(args[0]);
        return exponentialMovingAverage;
    };

    exponentialMovingAverage.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return exponentialMovingAverage;
    };

    return exponentialMovingAverage;
}
