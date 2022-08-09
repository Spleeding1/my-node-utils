/**
 * @package my-node-utils
 * my-messages.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-error-messages.js
 */

const message = require(`./../my-messages`);
const testData = require(`./test-data/type-testing`);

// ############################################################
// Unit Tests for TypeError messages
// ############################################################
// ****************************************
// function booleanTypeError(arg)
// ****************************************
describe(`booleanTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.boolean(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.isNotStringTypeError)(`should throw error if $arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.boolean(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.boolean(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be true or false!`));

		const result2 = message.typeError.boolean(`theBool`);
		expect(result2).toEqual(TypeError(`$theBool must be true or false!`));
	});
});

// ****************************************
// function nullStringOrArrayOfStringsTypeError(arg)
// ****************************************
describe(`nullStringOrArrayOfStringsTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.nullStringOrArrayOfStrings(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.isNotStringTypeError)(`should throw error if $arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.nullStringOrArrayOfStrings(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.nullStringOrArrayOfStrings(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be a string, string[], or null!`));

		const result2 = message.typeError.nullStringOrArrayOfStrings(`theString`);
		expect(result2).toEqual(TypeError(`$theString must be a string, string[], or null!`));
	});
});

// ****************************************
// function stringTypeError(arg)
// ****************************************
describe(`stringTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.string(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.isNotStringTypeError)(`should throw error if $arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.string(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.string(`theString`);
		expect(result1).toEqual(TypeError(`$theString must be a string!`));

		const result2 = message.typeError.string(`theArg`);
		expect(result2).toEqual(TypeError(`$theArg must be a string!`));
	});
});
