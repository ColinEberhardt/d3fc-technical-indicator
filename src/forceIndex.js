import { rebind } from 'd3fc-rebind';
import _slidingWindow from './slidingWindow';
import { identity } from './fn';
import exponentialMovingAverage from './exponentialMovingAverage';

export default function() {

    let volumeValue = (d, i) => d.volume;
    let closeValue = (d, i) => d.close;

    const emaComputer = exponentialMovingAverage()
        .period(13);

    const slidingWindow = _slidingWindow()
        .period(2)
        .accumulator(values => {
            let force;
            if (values && values.every(d => closeValue(d) != null && volumeValue(d) != null)) {
                force = (closeValue(values[1]) - closeValue(values[0])) * volumeValue(values[1]);
            }
            return force;
        });

    const force = data => {
        emaComputer.value(identity);
        const forceIndex = slidingWindow(data);
        return emaComputer(forceIndex);
    };

    force.volumeValue = (...args) => {
        if (!args.length) {
            return volumeValue;
        }
        volumeValue = args[0];
        return force;
    };
    force.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return force;
    };

    rebind(force, emaComputer, 'period');

    return force;
}
