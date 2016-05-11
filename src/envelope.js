import { identity, functor } from './fn';

export default function() {

    let factor = 0.1;
    let value = identity;

    const envelope = data => data.map(s =>
        ({
            lower: value(s) * (1.0 - factor),
            upper: value(s) * (1.0 + factor)
        })
    );

    envelope.factor = (...args) => {
        if (!args.length) {
            return factor;
        }
        factor = args[0];
        return envelope;
    };

    envelope.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = functor(args[0]);
        return envelope;
    };

    return envelope;
}