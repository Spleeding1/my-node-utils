const {timer} = require(`./../my-clock`);

describe(`performance testing timer`, () => {
	test(`timer should give a performance time`, () => {
		const startTime = timer.start();
		const stopTime = timer.stop(startTime);

		expect(isNaN(startTime)).toBeFalsy();
		expect(typeof stopTime).toBe(`string`);
		expect(stopTime).toMatch(/.[0-9]{3}s$/);
	});

	test(`timer.stop() should require one arg`, () => {
		expect(() => {
			const stop = timer.stop();
		}).toThrow();
	});
});
