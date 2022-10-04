/**
 * @package my-node-utils
 * my-JSON.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-JSON.hs
 */

const fs = require(`fs`);
const json = require(`./../my-JSON`);
const testData = require(`./test-data/type-testing`);
const is = require(`./../my-bools`);

const cwd = process.cwd();

// ****************************************
// function keyValueToString(JSONObject, args)
// ****************************************
describe(`keyValueToString`, () => {
	const JsonObject = {
		"The Key": "The Value",
		"Roasted Marshmallows": "Are Delicious",
		"Jalapenos": "are spicy",
		"Is Null": null,
		"Is True": true,
		"Is False": false,
		"A Number": 123,
		"Is Undefined": void 0,
		"Empty": "",
	};
	// ------------------------------
	// Argument Types
	// ------------------------------
	// ######## JsonObject ########
	test(`should not throw error if JsonObject is an object`, () => {
		expect(() => {
			json.keyValueToString(JsonObject);
		}).not.toThrow();
	});

	test.each(testData.type.isNotObject)(
		`should throw error if JsonObject is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(arg);
			}).toThrow(TypeError(`$JsonObject must be an object!`));
		}
	);

	// ######## args ########
	test.each(testData.type.isObjectOrNull)(
		`should not throw error if args is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, arg);
			}).not.toThrow();
		}
	);

	test.each(testData.type.isNotObjectOrNull)(
		`should throw error if args is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, arg);
			}).toThrow(TypeError(`$args must be an object or null!`));
		}
	);

	// ***** args.delimiter *****
	test(`should not throw error if args.delimiter is a string`, () => {
		expect(() => {
			json.keyValueToString(JsonObject, {delimiter: `abc`});
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if args.delimiter is type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {delimiter: arg});
			}).toThrow(TypeError(`$args.delimiter must be a string!`));
		}
	);

	// ***** args.keys *****
	test.each(testData.type.isArrayOfStringsOrString)(
		`should not throw error if args.keys is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {keys: arg});
			}).not.toThrow();
		}
	);

	test.each(testData.type.isNotArrayOfStringsOrString)(
		`should throw error if args.keys is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {keys: arg});
			}).toThrow(TypeError(`$args.keys must be a string[] or string!`));
		}
	);

	// ***** args.prefix *****
	test(`should not throw error if args.prefix is a string`, () => {
		expect(() => {
			json.keyValueToString(JsonObject, {prefix: `abc`});
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if args.prefix is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {prefix: arg});
			}).toThrow(TypeError(`$args.prefix must be a string!`));
		}
	);

	// ***** args.suffix *****
	test(`should not throw error if args.suffix is a string`, () => {
		expect(() => {
			json.keyValueToString(JsonObject, {suffix: `abc`});
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if args.suffix is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {suffix: arg});
			}).toThrow(TypeError(`$args.suffix must be a string!`));
		}
	);

	// ***** args.betweenEach *****
	test(`should not throw error if args.betweenEach is a string`, () => {
		expect(() => {
			json.keyValueToString(JsonObject, {betweenEach: `->`});
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if args.betweenEach is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {betweenEach: arg});
			}).toThrow(TypeError(`$args.betweenEach must be a string!`));
		}
	);

	// ***** args.changeEmpty *****
	test.each(testData.type.isBoolean)(
		`should not throw error if args.changeEmpty is a $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {changeEmpty: arg});
			}).not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if args.changeEmpty is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {changeEmpty: arg});
			}).toThrow(TypeError(`$args.changeEmpty must be true or false!`));
		}
	);

	// ***** args.ignoreEmpty *****
	test.each(testData.type.isBoolean)(
		`should not throw error if args.ignoreEmpty is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {ignoreEmpty: arg});
			}).not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if args.ignoreEmpty is $type`,
		({type, arg}) => {
			expect(() => {
				json.keyValueToString(JsonObject, {ignoreEmpty: arg});
			}).toThrow(TypeError(`$args.ignoreEmpty must be true or false!`));
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should return a string of all of the key: value pairs on new lines without key arg`, () => {
		const result = json.keyValueToString(JsonObject);

		expect(typeof result).toStrictEqual(`string`);
		expect(result).toStrictEqual(
			`The Key: The Value\nRoasted Marshmallows: Are Delicious\nJalapenos: are spicy\nIs Null: null\nIs True: true\nIs False: false\nA Number: 123\nIs Undefined: undefined\nEmpty: `
		);

		const result1 = json.keyValueToString(JsonObject, {});

		expect(result1).toStrictEqual(
			`The Key: The Value\nRoasted Marshmallows: Are Delicious\nJalapenos: are spicy\nIs Null: null\nIs True: true\nIs False: false\nA Number: 123\nIs Undefined: undefined\nEmpty: `
		);
	});

	test(`should return a string with customized delimiter`, () => {
		const result = json.keyValueToString(JsonObject, {delimiter: `->`});

		expect(result).toStrictEqual(
			`The Key->The Value\nRoasted Marshmallows->Are Delicious\nJalapenos->are spicy\nIs Null->null\nIs True->true\nIs False->false\nA Number->123\nIs Undefined->undefined\nEmpty->`
		);
	});

	test(`should return a string with only the selected key`, () => {
		const result = json.keyValueToString(JsonObject, {keys: `The Key`});
		expect(result).toStrictEqual(`The Key: The Value`);
	});

	test(`should return a string with only the selected keys`, () => {
		const result = json.keyValueToString(JsonObject, {keys: [`Jalapenos`, `Is True`]});
		expect(result).toStrictEqual(`Jalapenos: are spicy\nIs True: true`);
	});

	test(`should return a string that starts with prefix`, () => {
		const result = json.keyValueToString(JsonObject, {keys: `Jalapenos`, prefix: `\n`});
		expect(result).toStrictEqual(`\nJalapenos: are spicy`);
	});

	test(`should return a string that ends with suffix`, () => {
		const result = json.keyValueToString(JsonObject, {keys: `Jalapenos`, suffix: `\n`});
		expect(result).toStrictEqual(`Jalapenos: are spicy\n`);
	});

	test(`should return a string that betweenEach between keys`, () => {
		const result = json.keyValueToString(JsonObject, {
			keys: [`Jalapenos`, `Roasted Marshmallows`],
			betweenEach: ` and `,
		});
		expect(result).toStrictEqual(`Jalapenos: are spicy and Roasted Marshmallows: Are Delicious`);
	});

	test(`should return a string that does not have betweenEach if only one key`, () => {
		const result = json.keyValueToString(JsonObject, {keys: `Jalapenos`, betweenEach: `nooo`});
		expect(result).toStrictEqual(`Jalapenos: are spicy`);
	});

	test(`should change empty values to empty strings`, () => {
		const result = json.keyValueToString(JsonObject, {changeEmpty: true});

		expect(typeof result).toStrictEqual(`string`);
		expect(result).toStrictEqual(
			`The Key: The Value\nRoasted Marshmallows: Are Delicious\nJalapenos: are spicy\nIs Null: \nIs True: true\nIs False: \nA Number: 123\nIs Undefined: \nEmpty: `
		);
	});

	test(`should return a string without empty key: value pairs when args.ignoreEmpty is true`, () => {
		const result = json.keyValueToString(JsonObject, {ignoreEmpty: true});

		expect(result).toStrictEqual(
			`The Key: The Value\nRoasted Marshmallows: Are Delicious\nJalapenos: are spicy\nIs True: true\nA Number: 123`
		);
	});
});

// ****************************************
// async mergeJSON(defaultJSON, changeJSON)
// ****************************************
describe(`mergeJSON`, () => {
	const changeJSON = {key: `new value`, newKey: `value`};
	const changeJSONPath = `${cwd}/mergeJSONchange.json`;
	const defaultJSON = {key: `value`, noChange: `the same`};
	const defaultJSONPath = `${cwd}/mergeJSONdefault.json`;

	beforeAll(() => {
		fs.writeFileSync(changeJSONPath, `{"key": "new file value", "newFileKey": "value"}`);
		fs.writeFileSync(defaultJSONPath, `{"key": "file value", "noChange": "the same file"}`);
	});

	afterAll(() => {
		fs.rmSync(changeJSONPath);
		fs.rmSync(defaultJSONPath);
	});

	// ------------------------------
	// Argument Types
	// ------------------------------
	test.each([{arg: defaultJSON}, {arg: defaultJSONPath}])(
		`should not throw error if defaultJSON is $arg`,
		async ({arg}) => {
			await expect(json.merge(arg, changeJSON)).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotObjectOrString)(
		`should throw error if defaultJSON is $arg`,
		async ({type, arg}) => {
			await expect(json.merge(arg, changeJSON)).rejects.toThrow(
				TypeError(`$defaultJSON must be an object or a string!`)
			);
		}
	);

	test.each([{arg: changeJSON}, {arg: changeJSONPath}])(
		`should not throw an error if changeJSON is $arg`,
		async ({arg}) => {
			await expect(json.merge(defaultJSON, arg)).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotObjectOrString)(
		`should throw error if changeJSON is $type`,
		async ({type, arg}) => {
			await expect(json.merge(defaultJSON, arg)).rejects.toThrow(
				TypeError(`$changeJSON must be an object or a string!`)
			);
		}
	);

	test.each(testData.type.isBoolean)(
		`should not throw error if defaultKeysOnly is $type`,
		async ({type, arg}) => {
			await expect(json.merge(defaultJSON, changeJSON, arg)).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if defaultKeysOnly is $type`,
		async ({type, arg}) => {
			await expect(json.merge(defaultJSON, changeJSON, arg)).rejects.toThrow(
				TypeError(`$defaultKeysOnly must be true or false!`)
			);
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should merge changeJSON into defaultJSON`, async () => {
		const merged = await json.merge(defaultJSON, changeJSON);

		expect(merged).toStrictEqual({key: `new value`, noChange: `the same`, newKey: `value`});
	});

	test(`should merge changeJSONPath into defaultJSON`, async () => {
		const merged = await json.merge(defaultJSON, changeJSONPath);

		expect(merged).toStrictEqual({
			key: `new file value`,
			noChange: `the same`,
			newFileKey: `value`,
		});
	});

	test(`should merge changeJSON into defaultJSONPath`, async () => {
		const merged = await json.merge(defaultJSONPath, changeJSON);

		expect(merged).toStrictEqual({key: `new value`, noChange: `the same file`, newKey: `value`});
	});

	test(`should merge changeJSONPath into defaultJSONPath`, async () => {
		const merged = await json.merge(defaultJSONPath, changeJSONPath);

		expect(merged).toStrictEqual({
			key: `new file value`,
			noChange: `the same file`,
			newFileKey: `value`,
		});
	});

	test(`should not add changeJSON keys when defaultKeysOnly is true`, async () => {
		const merged = await json.merge(defaultJSON, changeJSON, true);

		expect(merged).toStrictEqual({
			key: `new value`,
			noChange: `the same`,
		});
	});
});
