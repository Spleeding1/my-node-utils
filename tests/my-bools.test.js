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
	const testArgs = [
		{type: `an object`, arg: {}, expected: true},
		{type: `null`, arg: null, expected: true},
		{type: `a string`, arg: `abc`, expected: false},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: false},
	];
	test.each(testArgs)(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.objectOrNull(arg);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});
