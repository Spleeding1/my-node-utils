/**
 * @package my-node-utils
 * my-messages.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-messages.js
 */

const message = require(`./../my-messages`);
const testData = require(`./test-data/type-testing`);

// ############################################################
// Unit Tests for TypeError messages
// ############################################################
// ****************************************
// function isNotBooleanTypeError(arg)
// ****************************************
describe(`function isNotBooleanTypeError(arg)`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotBoolean(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotBoolean(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotBoolean(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be true or false!`));

		const result2 = message.typeError.isNotBoolean(`theBool`);
		expect(result2).toEqual(TypeError(`$theBool must be true or false!`));
	});
});

// ****************************************
// function stringTypeError(arg)
// ****************************************
describe(`isNotStringTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotString(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotString(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotString(`theString`);
		expect(result1).toEqual(TypeError(`$theString must be a string!`));

		const result2 = message.typeError.isNotString(`theArg`);
		expect(result2).toEqual(TypeError(`$theArg must be a string!`));
	});
});

// ****************************************
// function isNotArrayOfStringsStringOrNullTypeError(arg)
// ****************************************
describe(`isNotArrayOfStringsStringOrNullTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotArrayOfStringsStringOrNull(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotArrayOfStringsStringOrNull(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotArrayOfStringsStringOrNull(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be a string[], string, or null!`));

		const result2 = message.typeError.isNotArrayOfStringsStringOrNull(`theString`);
		expect(result2).toEqual(TypeError(`$theString must be a string[], string, or null!`));
	});
});

// ****************************************
// function isNotNumberTypeError(arg)
// ****************************************
describe(`isNotNumberTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotNumber(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotNumber(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	const result1 = message.typeError.isNotNumber(`theArg`);
	expect(result1).toEqual(TypeError(`$theArg must be a number!`));

	const result2 = message.typeError.isNotNumber(`theString`);
	expect(result2).toEqual(TypeError(`$theString must be a number!`));
});

// ****************************************
// function isNotNumberTypeError(arg)
// ****************************************
describe(`isNotObjectTypeError`, () => {
	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotObject(`abc`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotObject(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	const result1 = message.typeError.isNotObject(`theArg`);
	expect(result1).toEqual(TypeError(`$theArg must be an object!`));

	const result2 = message.typeError.isNotObject(`theString`);
	expect(result2).toEqual(TypeError(`$theString must be an object!`));
});

// ****************************************
// function isNotObjectOrNullTypeError(arg)
// ****************************************
describe(`isNotObjectOrNullTypeError`, () => {
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotObjectOrNull(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if $arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotObjectOrNull(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotObjectOrNull(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be an object or null!`));

		const result2 = message.typeError.isNotObjectOrNull(`theString`);
		expect(result2).toEqual(TypeError(`$theString must be an object or null!`));
	});
});

// ****************************************
// function isNotObjectOrStringTypeError(arg)
// ****************************************
describe(`isNotObjectOrStringTypeError`, () => {
	test(`should not throw error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotObjectOrString(`$arg`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if $arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotObjectOrString(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotObjectOrString(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be an object or a string!`));

		const result2 = message.typeError.isNotObjectOrString(`theString`);
		expect(result2).toEqual(TypeError(`$theString must be an object or a string!`));
	});
});

// ****************************************
// isNotStringOrNullTypeError(arg)
// ****************************************
describe(`isNotStringOrNullTypeError`, () => {
	// ------------------------------
	// Argument Type
	// ------------------------------
	test(`should not throw an error if arg is a string`, () => {
		expect(() => {
			message.typeError.isNotStringOrNull(`abc`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if arg is $type`, ({type, arg}) => {
		expect(() => {
			message.typeError.isNotStringOrNull(arg);
		}).toThrow(TypeError(`$arg must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return TypeError`, () => {
		const result1 = message.typeError.isNotStringOrNull(`theArg`);
		expect(result1).toEqual(TypeError(`$theArg must be a string or null!`));

		const result2 = message.typeError.isNotStringOrNull(`theString`);
		expect(result2).toEqual(TypeError(`$theString must be a string or null!`));
	});
});
