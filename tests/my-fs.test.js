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
const message = require(`./../my-messages`);
const testData = require(`./test-data/type-testing`);

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

	// TODO: change to test each on the types.
	test(`should throw error if non-strings are given for destDir and srcDir`, async () => {
		expect.assertions(2);

		await expect(cleanUpAssets(123, `${cwd}/${srcDir}`)).rejects.toThrow(
			TypeError(`$destDir must be a string!`)
		);
		await expect(cleanUpAssets(`${cwd}/${destDir}`, 123)).rejects.toThrow(
			TypeError(`$srcDir must be a string!`)
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
	const srcDir = `${cwd}/getDirContentsSrc`;
	const srcDir1 = `${cwd}/getDirContentsSrc1`;
	const srcDir2 = `${cwd}/getDirContentsSrc2`;
	const srcDir3 = `${cwd}/getDirContentsSrc3`;
	const srcDir4 = `${cwd}/getDirContentsSrc4`;
	const dirThreeFiles = [
		`file1.txt`,
		`_file1.txt`,
		`file2.js`,
		`file2.min.js`,
		`file3.css`,
		`_file3.css`,
		`file3.min.css`,
		`file4.txt`,
		`aDirectory`,
	];
	const dirFourFiles = [
		`file1.txt`,
		`_file1.txt`,
		`file2.js`,
		`_file2.js`,
		`file2.min.js`,
		`file3.css`,
		`_file3.css`,
		`file3.min.css`,
		`file4.txt`,
		`_file4.txt`,
		`theFile.txt`,
		`aDirectory`,
	];

	beforeAll(async () => {
		await setUpTestDir(srcDir);
		await setUpTestDir(srcDir1, dirOneFiles);
		await setUpTestDir(srcDir2, dirTwoFiles);
		await setUpTestDir(srcDir3, dirThreeFiles);
		await setUpTestDir(srcDir4, dirFourFiles);
	});

	afterAll(async () => {
		await teardownTestDir(srcDir);
		await teardownTestDir(srcDir1);
		await teardownTestDir(srcDir2);
		await teardownTestDir(srcDir3);
		await teardownTestDir(srcDir4);
	});

	// ------------------------------
	// Argument types
	// ------------------------------
	// ######## Reusable test data ########
	const nullStringOrArrayOfStringsTypesPassing = [
		{type: `a string`, value: `abc`},
		{type: `an array`, value: [`abc`]},
		{type: `null`, value: null},
	];
	const nullStringOrArrayOfStringsTypesFailing = [
		{type: `an object`, value: {}},
		{type: `a number`, value: 123},
		{type: `true`, value: true},
		{type: `false`, value: false},
		{type: `an array with an object`, value: [`abc`, {}, `def`]},
		{type: `an array with a number`, value: [123, `abc`, `def`]},
		{type: `an array with true`, value: [`abc`, `def`, true]},
		{type: `an array with false`, value: [`abc`, false, `def`]},
		{type: `an array with null`, value: [null, `abc`, `def`]},
	];
	// ######## srcDir ########
	test(`should not throw error if srcDir is a string`, async () => {
		await expect(getDirContents(srcDir)).resolves.not.toThrowError();
	});

	test.each(testData.isNotStringTypeError)(
		`should throw error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(arg)).rejects.toThrow(TypeError(`$srcDir must be a string!`));
		}
	);

	// TODO: Convert args.include and args.exclude to regex
	// ######## args ########
	test.each([
		{type: `an object`, value: {}},
		{type: `null`, value: null},
	])(`should not throw error if args is $type`, async ({type, value}) => {
		await expect(getDirContents(srcDir, value)).resolves.not.toThrowError();
	});

	test.each([
		{type: `a string`, value: `abc`},
		{type: `a number`, value: 123},
		{type: `an array`, value: []},
		{type: `true`, value: true},
		{type: `false`, value: false},
	])(`should throw an error if args is $type`, async ({type, value}) => {
		await expect(getDirContents(srcDir, value)).rejects.toThrow(
			TypeError(`args must be an object or null`)
		);
	});

	// ***** args.include *****
	test.each(nullStringOrArrayOfStringsTypesPassing)(
		`should not throw error if args.include is $type`,
		async ({type, value}) => {
			const args = {include: value};
			await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
		}
	);

	test.each(nullStringOrArrayOfStringsTypesFailing)(
		`should throw an error if args.include is $type`,
		async ({type, value}) => {
			const args = {include: value};
			await expect(getDirContents(srcDir, args)).rejects.toThrow(
				TypeError(`$args.include must be a string, string[], or null!`)
			);
		}
	);

	// ***** args.exclude *****
	test.each(nullStringOrArrayOfStringsTypesPassing)(
		`should not throw error if args.exclude is $type`,
		async ({type, value}) => {
			const args = {exclude: value};
			await expect(getDirContents(srcDir, args)).resolves.not.toThrowError();
		}
	);

	test.each(nullStringOrArrayOfStringsTypesFailing)(
		`should throw an error if args.exclude is $type`,
		async ({type, value}) => {
			const args = {exclude: value};
			await expect(getDirContents(srcDir, args)).rejects.toThrow(
				TypeError(`$args.exclude must be a string, string[], or null!`)
			);
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	// test.each([
	// 	{dir: srcDir, length: 0},
	// 	{dir: srcDir1, length: 3},
	// 	{dir: srcDir2, length: 1},
	// ])(`should return an array of $dir contents`, async ({dir, length}) => {
	// 	const dirContents = await getDirContents(dir);
	// 	expect.assertions(2);
	// 	expect(is.array(dirContents)).toBeTruthy();
	// 	expect(dirContents.length).toBe(length);
	// });

	// ######## inclusion ########
	// test.each([
	// 	{dir: srcDir3, args: {include: {prefix: `_`}}, length: 2, files: [`_file1.txt`, `_file3.css`]},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {prefix: [`_`, `file2`]}},
	// 		length: 4,
	// 		files: [`_file1.txt`, `_file3.css`, `file2.js`, `file2.min.js`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {suffix: `.css`}},
	// 		length: 3,
	// 		files: [`file3.css`, `_file3.css`, `file3.min.css`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {suffix: [`.css`, `.txt`]}},
	// 		length: 6,
	// 		files: [`file3.css`, `_file3.css`, `file3.min.css`, `file1.txt`, `_file1.txt`, `file4.txt`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {prefix: `_`, suffix: `.txt`}},
	// 		length: 1,
	// 		files: [`_file1.txt`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {prefix: `_`, suffix: [`.css`, `.txt`]}},
	// 		length: 2,
	// 		files: [`_file3.css`, `_file1.txt`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {include: {prefix: [`_`, `file`], suffix: [`.css`, `.min.js`]}},
	// 		length: 4,
	// 		files: [`_file3.css`, `_file3.css`, `file3.min.css`, `file2.min.js`],
	// 	},
	// ])(`should only return $files with $args`, async ({dir, args, length, files}) => {
	// 	const dirContents = await getDirContents(dir, args);
	// 	expect.assertions();
	// 	expect(dirContents.length).toBe(length);
	// 	files.forEach(file => {
	// 		expect(dirContents.includes(file)).toBeTruthy();
	// 	});
	// });

	// ######## exclusion ########
	// test.each([
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {prefix: `_`}},
	// 		length: 7,
	// 		files: [
	// 			`file1.txt`,
	// 			`file2.js`,
	// 			`file2.min.js`,
	// 			`file3.css`,
	// 			`file3.min.css`,
	// 			`file4.txt`,
	// 			`aDirectory`,
	// 		],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {prefix: [`_`, `file2`]}},
	// 		length: 5,
	// 		files: [`file1.txt`, `file3.css`, `file3.min.css`, `file4.txt`, `aDirectory`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {suffix: `.css`}},
	// 		length: 6,
	// 		files: [`file1.txt`, `_file1.txt`, `file2.js`, `file2.min.js`, `file4.txt`, `aDirectory`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {suffix: [`.css`, `.txt`]}},
	// 		length: 3,
	// 		files: [`file2.js`, `file2.min.js`, `aDirectory`],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {prefix: `_`, suffix: `.txt`}},
	// 		length: 8,
	// 		files: [
	// 			`file1.txt`,
	// 			`file2.js`,
	// 			`file2.min.js`,
	// 			`file3.css`,
	// 			`_file3.css`,
	// 			`file3.min.css`,
	// 			`file4.txt`,
	// 			`aDirectory`,
	// 		],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {prefix: `_`, suffix: [`.css`, `.txt`]}},
	// 		length: 7,
	// 		files: [
	// 			`file1.txt`,
	// 			`file2.js`,
	// 			`file2.min.js`,
	// 			`file3.css`,
	// 			`file3.min.css`,
	// 			`file4.txt`,
	// 			`aDirectory`,
	// 		],
	// 	},
	// 	{
	// 		dir: srcDir3,
	// 		args: {exclude: {prefix: [`_`, `file2`], suffix: [`.css`, `.min.js`]}},
	// 		length: 7,
	// 		files: [
	// 			`file1.txt`,
	// 			`_file1.txt`,
	// 			`file2.js`,
	// 			`file3.css`,
	// 			`file3.min.css`,
	// 			`file4.txt`,
	// 			`aDirectory`,
	// 		],
	// 	},
	// ])(`should only return $files with $args`, async ({dir, args, length, files}) => {
	// 	const dirContents = await getDirContents(dir, args);
	// 	expect.assertions();
	// 	expect(dirContents.length).toBe(length);
	// 	files.forEach(file => {
	// 		expect(dirContents.includes(file)).toBeTruthy();
	// 	});
	// });

	// TODO: inclusion and exclusion filters

	// ######## inclusion and exclusion filtering ########

	// test.each([
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: `_`}, exclude: {prefix: `_file2`}},
	// 		length: 3,
	// 		files: [`_file1.txt`, , `_file3.css`, `_file4.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: `_`}, exclude: {prefix: [`_file2`, `_file3`]}},
	// 		length: 2,
	// 		files: [`_file1.txt`, `_file4.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: `_`}, exclude: {suffix: `.js`}},
	// 		length: 3,
	// 		files: [`_file1.txt`, `_file3.css`, `_file4.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: `_`}, exclude: {suffix: [`.js`, `.txt`]}},
	// 		length: 1,
	// 		files: [`_file3.css`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: `_`}, exclude: {prefix: `_file1`, suffix: `.js`}},
	// 		length: 2,
	// 		files: [`_file3.css`, `_file4.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: [`_`, `the`]}, exclude: {prefix: `_file2`}},
	// 		length: 4,
	// 		files: [`_file1.txt`, `_file3.css`, `_file4.txt`, `theFile.txt`],
	// 	},

	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {prefix: [`_`, `the`]}, exclude: {prefix: [`_file2`, `_file3`]}},
	// 		length: 3,
	// 		files: [`_file1.txt`, `_file4.txt`, `theFile.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {suffix: `.js`}, exclude: {suffix: `.min.js`}},
	// 		length: 2,
	// 		files: [`file2.js`, `_file2.js`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {suffix: [`.js`, `.css`]}, exclude: {suffix: `.min.js`}},
	// 		length: 5,
	// 		files: [`file2.js`, `_file2.js`, `file3.css`, `_file3.css`, `file3.min.css`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {suffix: `.txt`}, exclude: {suffix: [`4.txt`, `1.txt`]}},
	// 		length: 1,
	// 		files: [`theFile.txt`],
	// 	},
	// 	{
	// 		dir: srcDir4,
	// 		args: {include: {suffix: [`.css`, `.txt`]}, exclude: {suffix: [`4.txt`, `1.txt`]}},
	// 		length: 4,
	// 		files: [`file3.css`, `_file3.css`, `file3.min.css`, `theFile.txt`],
	// 	},
	// ])(`should only return $files with $args`, async ({dir, args, length, files}) => {
	// 	const dirContents = await getDirContents(dir, args);
	// 	expect.assertions();
	// 	expect(dirContents.length).toBe(length);
	// 	files.forEach(file => {
	// 		expect(dirContents.includes(file)).toBeTruthy();
	// 	});
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
 * @param {string<array>?} dirFiles Array of filenames to be written to the created directory.
 */
async function setUpTestDir(dir, dirFiles = null) {
	if (!is.string(dir)) {
		throw message.typeError.string(`dir`);
	}
	if (dirFiles && !is.array(dirFiles)) {
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
		throw message.typeError.string(`dir`);
	}

	if (fs.existsSync(dir)) {
		fs.rmSync(dir, {recursive: true, force: true});
	}
}
