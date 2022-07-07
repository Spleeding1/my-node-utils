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
const is = require(`./../my-bools`);

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
//         include: {
//             prefix: null,
//             suffix: null
//         },
//         exclude: {
//             prefix: null,
//             suffix: null
//         },
//     }
// )
// ****************************************
describe(`getDirContents`, () => {
	const objectOrNullTypesPassing = [
		{type: `an object`, value: {}},
		{type: `null`, value: null},
	];
	const objectOrNullTypesFailing = [
		{type: `a string`, value: `abc`},
		{type: `a number`, value: 123},
		{type: `an array`, value: []},
		{type: `true`, value: true},
		{type: `false`, value: false},
	];
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

	test.each([
		{type: `a number`, srcDir: 123},
		{type: `an object`, srcDir: {}},
		{type: `null`, srcDir: null},
		{type: `an array`, srcDir: []},
		{type: `true`, srcDir: true},
		{type: `false`, srcDir: false},
	])(`should throw error if srcDir is $type`, async ({type, srcDir}) => {
		await expect(getDirContents(srcDir)).rejects.toThrow(TypeError(`srcDir must be a string`));
	});

	// ######## args ########
	test.each(objectOrNullTypesPassing)(
		`should not throw error if args is $type`,
		async ({type, value}) => {
			await expect(getDirContents(srcDir, value)).resolves.not.toThrowError();
		}
	);

	test.each(objectOrNullTypesFailing)(
		`should throw an error if args is $type`,
		async ({type, value}) => {
			await expect(getDirContents(srcDir, value)).rejects.toThrow(
				TypeError(`args must be an object or null`)
			);
		}
	);

	// ***** args.include *****
	test.each(objectOrNullTypesPassing)(
		`should not throw error if args.include is $type`,
		async ({type, value}) => {
			const args = {include: value};
			await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
		}
	);

	test.each(objectOrNullTypesFailing)(
		`should throw an error if args.include is $type`,
		async ({type, value}) => {
			const args = {include: value};
			await expect(getDirContents(srcDir, args)).rejects.toThrow(
				TypeError(`args.include must be an object or null`)
			);
		}
	);

	// --- args.include.prefix ---
	test.each([
		{type: `a string`, value: `abc`},
		{type: `an array`, value: [`abc`]},
		{type: `null`, value: null},
	])(`should not throw an error if args.include.prefix is $type`, async ({type, value}) => {
		const args = {include: {prefix: value}};
		await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
	});

	test.each([
		{type: `an object`, value: {}},
		{type: `a number`, value: 123},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `an array with an object`, value: [`abc`, {}, `def`]},
		{type: `an array with a number`, value: [123, `abc`, `def`]},
		{type: `an array with true`, value: [`abc`, `def`, true]},
		{type: `an array with false`, value: [`abc`, false, `def`]},
		{type: `an array with null`, value: [null, `abc`, `def`]},
	])(`should throw error if arg.include.prefix is $type`, async ({type, value}) => {
		const args = {include: {prefix: value}};
		await expect(getDirContents(srcDir, args)).rejects.toThrow(
			TypeError(`args.include.prefix must be a string or an string[] or null`)
		);
	});

	// --- args.include.suffix ---
	test.each([
		{type: `a string`, value: `abc`},
		{type: `an array`, value: [`abc`]},
		{type: `null`, value: null},
	])(`should not throw an error if args.include.suffix is $type`, async ({type, value}) => {
		const args = {include: {suffix: value}};
		await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
	});

	test.each([
		{type: `an object`, value: {}},
		{type: `a number`, value: 123},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `an array with an object`, value: [`abc`, {}, `def`]},
		{type: `an array with a number`, value: [123, `abc`, `def`]},
		{type: `an array with true`, value: [`abc`, `def`, true]},
		{type: `an array with false`, value: [`abc`, false, `def`]},
		{type: `an array with null`, value: [null, `abc`, `def`]},
	])(`should throw error if arg.include.suffix is $type`, async ({type, value}) => {
		const args = {include: {suffix: value}};
		await expect(getDirContents(srcDir, args)).rejects.toThrow(
			TypeError(`args.include.suffix must be a string or an string[] or null`)
		);
	});

	// ***** args.exclude *****
	test.each(objectOrNullTypesPassing)(
		`should not throw error if args.exclude is $type`,
		async ({type, value}) => {
			const args = {exclude: value};
			await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
		}
	);

	test.each(objectOrNullTypesFailing)(
		`should throw an error if args.exclude is $type`,
		async ({type, value}) => {
			const args = {exclude: value};
			await expect(getDirContents(srcDir, args)).rejects.toThrow(
				TypeError(`args.exclude must be an object or null`)
			);
		}
	);

	// --- args.exclude.prefix ---
	test.each([
		{type: `a string`, value: `abc`},
		{type: `an array`, value: [`abc`]},
		{type: `null`, value: null},
	])(`should not throw an error if args.exclude.prefix is $type`, async ({type, value}) => {
		const args = {exclude: {prefix: value}};
		await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
	});

	test.each([
		{type: `an object`, value: {}},
		{type: `a number`, value: 123},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `an array with an object`, value: [`abc`, {}, `def`]},
		{type: `an array with a number`, value: [123, `abc`, `def`]},
		{type: `an array with true`, value: [`abc`, `def`, true]},
		{type: `an array with false`, value: [`abc`, false, `def`]},
		{type: `an array with null`, value: [null, `abc`, `def`]},
	])(`should throw error if arg.include.prefix is $type`, async ({type, value}) => {
		const args = {exclude: {prefix: value}};
		await expect(getDirContents(srcDir, args)).rejects.toThrow(
			TypeError(`args.exclude.prefix must be a string or an string[] or null`)
		);
	});

	// --- args.exclude.suffix ---
	test.each([
		{type: `a string`, value: `abc`},
		{type: `an array`, value: [`abc`]},
		{type: `null`, value: null},
	])(`should not throw an error if args.exclude.suffix is $type`, async ({type, value}) => {
		const args = {exclude: {suffix: value}};
		await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
	});

	test.each([
		{type: `an object`, value: {}},
		{type: `a number`, value: 123},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `an array with an object`, value: [`abc`, {}, `def`]},
		{type: `an array with a number`, value: [123, `abc`, `def`]},
		{type: `an array with true`, value: [`abc`, `def`, true]},
		{type: `an array with false`, value: [`abc`, false, `def`]},
		{type: `an array with null`, value: [null, `abc`, `def`]},
	])(`should throw error if arg.exclude.suffix is $type`, async ({type, value}) => {
		const args = {exclude: {suffix: value}};
		await expect(getDirContents(srcDir, args)).rejects.toThrow(
			TypeError(`args.exclude.suffix must be a string or an string[] or null`)
		);
	});
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
	if (!is.string(dir)) {
		throw TypeError(`dir must be a string`);
	}
	if (!is.array(dirFiles)) {
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
	if (!is.string(dir)) {
		throw TypeError(`dir must be a string`);
	}

	if (fs.existsSync(dir)) {
		fs.rmSync(dir, {recursive: true, force: true});
	}
}
