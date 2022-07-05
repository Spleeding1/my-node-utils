/**
 * @package my-node-utils
 * my-clock.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-clock.js functions.
 */

const {timer} = require(`./../my-clock`);

// ****************************************
// function stopTimer(startTime)
// ****************************************

describe(`performance testing timer`, () => {
	test(`should give a performance time`, () => {
		const startTime = timer.start();
		const stopTime = timer.stop(startTime);

		expect(isNaN(startTime)).toBeFalsy();
		expect(stopTime.constructor).toBe(String);
		expect(stopTime).toMatch(/.[0-9]{3}s$/);
	});

	test(`timer.stop() should throw error if startTime is not a number`, () => {
		expect(() => {
			timer.stop(`123`);
		}).toThrow(TypeError(`startTime must be a number`));
	});
});
