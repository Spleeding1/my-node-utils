/**
 * @package my-node-utils
 * my-fs.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-fs.js
 */

const {cleanUpAssets, copyDirContents, getDirContents} = require(`./../my-fs`);
const fs = require(`fs`);
const {assert} = require("console");

// Test variables.
const cwd = process.cwd();
const dirOneFiles = [`one.txt`, `two.txt`, `three.txt`];
const dirTwoFiles = [`one.txt`];

// ############################################################
// my-fs.js unittests for functions
// ############################################################

// ****************************************
// async function cleanUpAssets(
//     destDir,
//     srcDir,
//     fileExt = null
// )
// ****************************************

describe(`cleanUpAssets`, () => {
	const srcDir = `cleanUpAssetsSrc`;
	const destDir = `cleanUpAssetsDest`;

	beforeEach(async () => {
		await setUpTestDir(srcDir, dirTwoFiles);
		await setUpTestDir(destDir, dirOneFiles);
	});

	afterEach(() => {
		[srcDir, destDir].forEach(async dir => {
			await teardownTestDir(dir);
		});
	});

	test(`should accept strings for destDir and srcDir`, async () => {
		await expect(
			cleanUpAssets(`${cwd}/${destDir}`, `${cwd}/${srcDir}`)
		).resolves.not.toThrowError();
	});

	test(`should throw error if non-strings are given for destDir and srcDir`, async () => {
		expect.assertions(2);

		await expect(cleanUpAssets(123, `${cwd}/${srcDir}`)).rejects.toThrow(
			TypeError(`destDir must be a string`)
		);
		await expect(cleanUpAssets(`${cwd}/${destDir}`, 123)).rejects.toThrow(
			TypeError(`srcDir must be a string`)
		);
		// TODO: come back after getDirContents is tested. Make fileExt an excludes = {srcPrefix, srcSuffix} to ignore files.
		// expect(true).toBeFalsy();
	});

	test(`should remove files from the destDir that are not in the srcDir`, async () => {
		await cleanUpAssets(`${cwd}/${destDir}`, `${cwd}/${srcDir}`, `.txt`);

		expect(fs.existsSync(`${cwd}/${destDir}/one.txt`)).toBeTruthy();
		expect(fs.existsSync(`${cwd}/${destDir}/two.txt`)).toBeFalsy();
		expect(fs.existsSync(`${cwd}/${destDir}/three.txt`)).toBeFalsy();
	});
});

// ****************************************
// async function copyDirContents(
//     sourceDir,
//     targetDir,
//     fileSuffix = null
// )
// ****************************************
describe(`copyDirContents`, () => {
	const srcDir = `${cwd}/copyDirContentsSrc`;
	const destDir = `${cwd}/copyDirContentsDest`;

	beforeEach(async () => {
		await setUpTestDir(srcDir, dirOneFiles);
	});

	afterEach(() => {
		[srcDir, destDir].forEach(async dir => {
			await teardownTestDir(dir);
		});
	});

	// TODO: finish test
	test(`should create destDir if it does not exist`, async () => {
		// await copyDirContents(srcDir, destDir);
		// expect(true).toBeFalsy();
	});
});

// ****************************************
// async function getDirContents(
//     srcDir,
//     args = {
//         include = {
//             prefix: null
//             suffix: null
//         },
//         exclude = {
//             prefix: null
//             suffix: null
//         },
//     }
// )
// ****************************************
describe(`getDirContents`, () => {
	const srcDir = `${cwd}/getDirContentsSrc`;

	beforeEach(async () => {
		await setUpTestDir(srcDir, dirOneFiles);
	});

	afterEach(async () => {
		await teardownTestDir(srcDir);
	});

	// ------------------------------
	// Argument types
	// ------------------------------
	// ######## srcDir ########
	test(`should not throw error if srcDir is a string`, async () => {
		await expect(getDirContents(srcDir)).resolves.not.toThrowError();
	});

	test(`should throw error if srcDir is not a string`, async () => {
		await expect(getDirContents(123)).rejects.toThrow(TypeError(`srcDir must be a string`));
	});

	// ######## args ########
	test(`should not throw error if args is an object or null`, async () => {
		expect.assertions(2);
		await expect(getDirContents(srcDir, {})).resolves.not.toThrowError();
		await expect(getDirContents(srcDir, null)).resolves.not.toThrowError();
	});

	// test(`should throw error if args is not an object`, async () => {
	// 	expect.assertions(1);
	// 	await expect(getDirContents(srcDir)).resolves.not.toThrowError();
	// });

	// test(`should not throw error if exclude is a string, array, or null`, async () => {
	// 	expect.assertions(3);

	// 	await expect(getDirContents(srcDir, `.txt`)).resolves.not.toThrowError();
	// 	await expect(getDirContents(srcDir, [`.txt`, `.css`])).resolves.not.toThrowError();
	// 	await expect(getDirContents(srcDir, null)).resolves.not.toThrowError();
	// });

	// test(`should throw error if exclude is not a string, array, or null`, async () => {
	// 	await expect(getDirContents(srcDir, 123)).rejects.toThrow(
	// 		TypeError(`exclude must be a string, array of strings, or null`)
	// 	);
	// });

	// test(`should throw error if exclude array contains non-strings`, async () => {
	// 	await expect(getDirContents(srcDir, [`.txt`, 123])).rejects.toThrow(
	// 		TypeError(`exclude must be a string, array of strings, or null`)
	// 	);
	// });
});

// ############################################################
// Re-usable Testing Functions
// ############################################################

// ****************************************
// Setup Functions
// ****************************************

/**
 * Creates a directory and optionally writes files in it for testing.
 * @param {string} dir Path of directory to be created.
 * @param {?string<array>} dirFiles Array of filenames to be written to the created directory.
 */
async function setUpTestDir(dir, dirFiles = null) {
	if (dir.constructor !== String) {
		throw TypeError(`dir must be a string`);
	}
	if (!Array.isArray(dirFiles)) {
		throw TypeError(`dirFiles must be an array`);
	}
	fs.mkdirSync(dir);

	if (dirFiles) {
		dirFiles.forEach(file => {
			fs.writeFileSync(`${dir}/${file}`, ``);
		});
	}
}

// ****************************************
// Teardown Functions
// ****************************************

/**
 * Deletes a directory.
 * @param {string} dir Path of directory to be deleted.
 */
async function teardownTestDir(dir) {
	if (dir.constructor !== String) {
		throw TypeError(`dir must be a string`);
	}

	if (fs.existsSync(dir)) {
		fs.rmSync(dir, {recursive: true, force: true});
	}
}
