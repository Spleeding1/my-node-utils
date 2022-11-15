/**
 * @package my-node-utils
 * my-strings.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-strings.js
 */

const format = require(`../my-formatting`);
const testData = require(`./test-data/type-testing`);

describe(`formatDate`, () => {
	const date = Date(`2022-11-08T04:26:51.269Z`);

	// ------------------------------
	// Argument type check
	// ------------------------------
	test(`should not throw error if theDate is a date`, () => {
		const theDate = new Date();
		expect(() => {
			format.date(theDate);
		}).not.toThrow();
	});
	// TODO: d: 1-31

	// TODO: dd: 01-31
	// TODO: D: M
	// TODO: DD: Mon
	// TODO: DDD: Monday
});

describe(`formatString`, () => {
	const inputString = `This is an input string`;
	const inputStrings = [
		{inStr: `This is an input string`},
		{inStr: `This is an input_string`},
		{inStr: `This is an input.string`},
		{inStr: `This is an input,string`},
		{inStr: `This is an input-string`},
	];

	// ------------------------------
	// Argument types
	// ------------------------------
	// ######## inputString ########
	test(`should not throw an error if inputString is a string`, () => {
		expect(() => {
			format.string(inputString, `slug`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if inputString is $type`,
		({type, arg}) => {
			expect(() => {
				format.string(arg, `slug`);
			}).toThrow(TypeError(`$inputString must be a string!`));
		}
	);

	// ######## format ########
	test(`should not throw error if format is a string`, () => {
		expect(() => {
			format.string(inputString, `slug`, ` `);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if format is $type`, ({type, arg}) => {
		expect(() => {
			format.string(inputString, arg, ` `);
		}).toThrow(TypeError(`$format must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each(inputStrings)(`should return camelCaseString if format is camel`, ({inStr}) => {
		const result = format.string(inStr, `camel`);
		expect(result).toStrictEqual(`thisIsAnInputString`);
	});

	test.each(inputStrings)(`should return CapsString if format is caps`, ({inStr}) => {
		const result = format.string(inStr, `caps`);
		expect(result).toStrictEqual(`ThisIsAnInputString`);
	});

	test.each(inputStrings)(`should return lowerstring if format is lower`, ({inStr}) => {
		const result = format.string(inStr, `lower`);
		expect(result).toStrictEqual(`thisisaninputstring`);
	});

	test.each(inputStrings)(`should return slug-string if format is slug`, ({inStr}) => {
		const result = format.string(inStr, `slug`);
		expect(result).toStrictEqual(`this-is-an-input-string`);
	});

	test.each(inputStrings)(`should return snake_string if format is snake`, ({inStr}) => {
		const result = format.string(inStr, `snake`);
		expect(result).toStrictEqual(`this_is_an_input_string`);
	});

	test.each(inputStrings)(`should return UPPER_SNAKE_STRING if format is upperSnake`, ({inStr}) => {
		const result = format.string(inStr, `upperSnake`);
		expect(result).toStrictEqual(`THIS_IS_AN_INPUT_STRING`);
	});
});
