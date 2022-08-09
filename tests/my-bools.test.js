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
// isArray(arg)
// ****************************************
describe(`isArray`, () => {
	test.each([
		{type: `an object`, arg: {}, expected: false},
		{type: `null`, arg: null, expected: false},
		{type: `a string`, arg: `abc`, expected: false},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: true},
	])(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.array(arg);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});

// ****************************************
// isArrayOfStrings(array)
// ****************************************
describe(`isArrayOfStrings`, () => {
	test.each([
		{type: `an array with strings`, value: [`abc`, `def`, `ghi`], expected: true},
		{type: `an array with an object`, value: [`abc`, {}, `def`], expected: false},
		{type: `an array with a number`, value: [123, `abc`, `def`], expected: false},
		{type: `an array with true`, value: [`abc`, `def`, true], expected: false},
		{type: `an array with false`, value: [`abc`, false, `def`], expected: false},
		{type: `an array with null`, value: [null, `abc`, `def`], expected: false},
	])(`should return $expected if array is $type`, ({type, value, expected}) => {
		const result = is.arrayOfStrings(value);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});

// ****************************************
// isBoolean(arg)
// ****************************************
describe(`isBoolean`, () => {
	test.each([
		[
			{type: `an object`, arg: {}, expected: false},
			{type: `null`, arg: null, expected: false},
			{type: `a string`, arg: `abc`, expected: false},
			{type: `true`, arg: true, expected: true},
			{type: `false`, arg: false, expected: true},
			{type: `a number`, arg: 123, expected: false},
			{type: `an array`, arg: [], expected: false},
		],
	])(`should return $expected if arg is $type`, ({type, value, expected}) => {
		const result = is.boolean(value);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});

// ****************************************
// isNullStringOrArray(arg)
// ****************************************
describe(`isNullStringOrArray`, () => {
	test.each([
		{type: `an object`, arg: {}, expected: false},
		{type: `null`, arg: null, expected: true},
		{type: `a string`, arg: `abc`, expected: true},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: true},
	])(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.nullStringOrArray(arg);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});

// ****************************************
// isObjectOrNull(arg)
// ****************************************
describe(`isObjectOrNull`, () => {
	test.each([
		{type: `an object`, arg: {}, expected: true},
		{type: `null`, arg: null, expected: true},
		{type: `a string`, arg: `abc`, expected: false},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: false},
	])(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.objectOrNull(arg);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});

// ****************************************
// isObjectWithProperty(arg, property)
// ****************************************
describe(`is.objectWithProperty`, () => {
	const arg = {hasProperty: `yes`};

	// ######## arg ########
	test.each([
		{type: `an empty object`, value: {}, expected: false},
		{type: `an object with property`, value: {hasProperty: `yes`}, expected: true},
		{type: `an object without property`, value: {hasNotProperty: `no`}, expected: false},
		{type: `null`, value: null, expected: false},
		{type: `true`, value: true, expected: false},
		{type: `false`, value: false, expected: false},
		{type: `an array`, value: [], expected: false},
		{type: `a string`, value: `abc`, expected: false},
		{type: `a number`, value: 123, expected: false},
	])(`should return $expected when arg is $type`, ({type, value, expected}) => {
		const result = is.objectWithProperty(value, `hasProperty`);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});

	// ######## property ########
	test(`should not throw an error if property is a string`, () => {
		expect(() => {
			is.objectWithProperty(arg, `hasProperty`);
		}).not.toThrowError();
	});

	test.each([
		{type: `a number`, value: 123},
		{type: `an object`, value: {}},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `null`, value: null},
		{type: `an array`, value: []},
	])(`should throw an error if property is $type`, ({type, value}) => {
		expect(() => {
			is.objectWithProperty(arg, value);
		}).toThrow(TypeError(`$property must be a string!`));
	});
});

// ****************************************
// isString(arg)
// ****************************************
describe(`is.string`, () => {
	test.each([
		{type: `an object`, arg: {}, expected: false},
		{type: `null`, arg: null, expected: false},
		{type: `a string`, arg: `abc`, expected: true},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: false},
	])(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.string(arg);
		expect(result).toBe(expected);
		expect(typeof result).toBe(`boolean`);
	});
});
