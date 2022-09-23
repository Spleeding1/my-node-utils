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

const cwd = process.cwd();

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
