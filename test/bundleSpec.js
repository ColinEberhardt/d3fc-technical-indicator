import jsdom from 'jsdom';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
        jsdom.env({
            html: '<html></html>',
            virtualConsole: jsdom.createVirtualConsole().sendTo(console),
            scripts: [
                './node_modules/d3-array/build/d3-array.js',
                './node_modules/d3fc-rebind/build/d3fc-rebind.js',
                './build/d3fc-technical-indicator.js'
            ],
            done: (_, win) => {
                const data = [0, 1, 6, 4, 8];
                const indicator = win.fc.movingAverage();
                const transformed = indicator(data);
                expect(transformed).not.toBeUndefined();
                done();
            }
        });
    });
});
