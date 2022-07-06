/**
 * @package my-node-utils
 * my-bools.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-bools.js
 */

const is = require(`./../my-bools`);

// ############################################################
// Unittests for functions
// ############################################################

// ****************************************
// is.objectOrNull(arg)
// ****************************************
describe(`is.objectOrNull`, () => {
	test(`should return true if arg is an object or null`, () => {
		const result1 = is.objectOrNull({});
		expect(result1).toBeTruthy();
		expect(typeof result1).toEqual(`boolean`);

		const result2 = is.objectOrNull(null);
		expect(result2).toBeTruthy();
		expect(typeof result2).toEqual(`boolean`);
	});

	test(`should return false if arg is not an object or null`, () => {
		const result1 = is.objectOrNull(`abc`);
		expect(result1).toBeFalsy();
		expect(typeof result1).toEqual(`boolean`);

		const result2 = is.objectOrNull(123);
		expect(result2).toBeFalsy();
		expect(typeof result2).toEqual(`boolean`);

		const result3 = is.objectOrNull(true);
		expect(result3).toBeFalsy();
		expect(typeof result3).toEqual(`boolean`);

		const result4 = is.objectOrNull([]);
		expect(result4).toBeFalsy();
		expect(typeof result4).toEqual(`boolean`);
	});
});
