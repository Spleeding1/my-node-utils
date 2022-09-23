/**
 * @package my-node-utils
 * my-bools.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-bools.js
 */

const is = require(`./../my-bools`);
const testData = require(`./test-data/type-testing`);

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
		expect(result).toStrictEqual(expected);
		expect(typeof result).toStrictEqual(`boolean`);
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
		expect(result).toStrictEqual(expected);
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isArrayStringOrNull(arg)
// ****************************************
describe(`isArrayStringOrNull`, () => {
	test.each([
		{type: `an object`, arg: {}, expected: false},
		{type: `null`, arg: null, expected: true},
		{type: `a string`, arg: `abc`, expected: true},
		{type: `true`, arg: true, expected: false},
		{type: `false`, arg: false, expected: false},
		{type: `a number`, arg: 123, expected: false},
		{type: `an array`, arg: [], expected: true},
	])(`should return $expected if arg is $type`, ({type, arg, expected}) => {
		const result = is.ArrayStringOrNull(arg);
		expect(result).toStrictEqual(expected);
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isBoolean(arg)
// ****************************************
describe(`isBoolean`, () => {
	test.each(testData.type.isBoolean)(`should return true if arg is $type`, ({type, arg}) => {
		const result = is.boolean(arg);
		expect(result).toBeTruthy();
		expect(typeof result).toStrictEqual(`boolean`);
	});
	test.each(testData.type.isNotBoolean)(`should return false if arg is $type`, ({type, arg}) => {
		const result = is.boolean(arg);
		expect(result).toBeFalsy();
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isNumber(arg)
// ****************************************
describe(`is.number`, () => {
	test(`should return true if arg is a number`, () => {
		const result1 = is.number(123);
		expect(result1).toStrictEqual(true);
		expect(typeof result1).toStrictEqual(`boolean`);

		const result2 = is.number(123.123);
		expect(result2).toStrictEqual(true);
		expect(typeof result2).toStrictEqual(`boolean`);
	});

	test.each(testData.type.isNotNumber)(`should return false if arg is $type`, ({type, arg}) => {
		const result = is.number(arg);
		expect(result).toStrictEqual(false);
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isObject(arg)
// ****************************************
describe(`isObject`, () => {
	test(`should return true if arg is an object`, () => {
		const result = is.object({});
		expect(result).toBeTruthy();
		expect(typeof result).toStrictEqual(`boolean`);
	});
	test.each(testData.type.isNotObject)(`should return false if arg is $type`, ({type, arg}) => {
		const result = is.object(arg);
		expect(result).toBeFalsy();
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isObjectOrNull(arg)
// ****************************************
describe(`isObjectOrNull`, () => {
	test.each(testData.type.isObjectOrNull)(`should return true if arg is $type`, ({type, arg}) => {
		const result = is.objectOrNull(arg);
		expect(result).toBeTruthy();
		expect(typeof result).toStrictEqual(`boolean`);
	});
	test.each(testData.type.isNotObjectOrNull)(
		`should return false if arg is $type`,
		({type, arg}) => {
			const result = is.objectOrNull(arg);
			expect(result).toBeFalsy();
			expect(typeof result).toStrictEqual(`boolean`);
		}
	);
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
		expect(result).toStrictEqual(expected);
		expect(typeof result).toStrictEqual(`boolean`);
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
	test(`should return true if arg is a string`, () => {
		const result = is.string(`123`);
		expect(result).toStrictEqual(true);
		expect(typeof result).toStrictEqual(`boolean`);
	});

	test.each(testData.type.isNotString)(`should return false if arg is $type`, ({type, arg}) => {
		const result = is.string(arg);
		expect(result).toStrictEqual(false);
		expect(typeof result).toStrictEqual(`boolean`);
	});
});

// ****************************************
// isStringOrNull(arg)
// ****************************************
describe(`isStringOrNull`, () => {
	test.each(testData.type.isStringOrNull)(
		`should not throw an error if arg is $type`,
		({type, arg}) => {
			const result = is.stringOrNull(arg);
			expect(result).toStrictEqual(true);
			expect(typeof result).toStrictEqual(`boolean`);
		}
	);

	test.each(testData.type.isNotStringOrNull)(
		`should  throw an error if arg is $type`,
		({type, arg}) => {
			const result = is.stringOrNull(arg);
			expect(result).toStrictEqual(false);
			expect(typeof result).toStrictEqual(`boolean`);
		}
	);
});
