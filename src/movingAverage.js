import { mean } from 'd3-array';
import { rebind } from 'd3fc-rebind';
import _slidingWindow from './slidingWindow';

export default function() {

    const slidingWindow = _slidingWindow()
        .accumulator(values => {
            let ma;
            if (values && values.every(d => d != null)) {
                ma = mean(values);
            }
            return ma;
        });

    const movingAverage = data => slidingWindow(data);

    rebind(movingAverage, slidingWindow, 'period', 'value');

    return movingAverage;
}
