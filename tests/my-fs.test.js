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
const dirOneFiles = [
	`file1.txt`,
	`_file1.txt`,
	`file2.js`,
	`file2.min.js`,
	`file3.css`,
	`_file3.css`,
	`file3.min.css`,
	`file4.txt`,
];
const dirTwoFiles = [
	`file1.txt`,
	`_file1.txt`,
	`file2.js`,
	`file2.min.js`,
	`file3.css`,
	`_file3.css`,
	`file3.min.css`,
	`file4.txt`,
	`theFile.txt`,
	`anotherFile.css`,
];
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
	const destDir = `${cwd}/cleanUpAssetsDest`;
	const srcDir = `${cwd}/cleanUpAssetsSrc`;

	beforeEach(async () => {
		await setUpTestDir(srcDir, dirOneFiles);
		await setUpTestDir(destDir, dirTwoFiles);
	});

	afterEach(() => {
		[srcDir, destDir].forEach(async dir => {
			await teardownTestDir(dir);
		});
	});

	// ------------------------------
	// Argument types
	// ------------------------------
	test(`should accept strings for destDir and srcDir`, async () => {
		await expect(cleanUpAssets(srcDir, destDir)).resolves.not.toThrowError();
	});

	// ######## srcDir failing ########
	test.each(testData.isNotStringTypeError)(
		`should throw an error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(arg, destDir)).rejects.toThrow(
				TypeError(`$srcDir must be a string!`)
			);
		}
	);

	// ######## destDir failing ########
	test.each(testData.isNotStringTypeError)(
		`should throw an error if destDir is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, arg)).rejects.toThrow(
				TypeError(`$destDir must be a string!`)
			);
		}
	);

	// ######## args ########
	test.each([
		{type: `null`, arg: null},
		{type: `an object`, arg: {}},
	])(`should not throw an error if args is $type`, async ({type, arg}) => {
		await expect(cleanUpAssets(srcDir, destDir, arg)).resolves.not.toThrowError();
	});

	test.each([
		{type: `a string`, value: `abc`},
		{type: `a number`, value: 123},
		{type: `an array`, value: []},
		{type: `true`, value: true},
		{type: `false`, value: false},
	])(`should throw an error if args is $type`, async ({type, value}) => {
		await expect(cleanUpAssets(srcDir, destDir, value)).rejects.toThrow(
			TypeError(`$args must be an object or null!`)
		);
	});

	// ######## args.minified ########
	test.each(testData.isBoolean)(
		`should not throw error if args.minified is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, {minified: true})).resolves.not.toThrowError();
		}
	);

	test.each(testData.isNotBooleanTypeError)(
		`should throw error if args.minified is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, {minified: arg})).rejects.toThrowError();
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each([
		{
			args: {include: /.css$/},
			length: 3,
			files: [`file3.css`, `_file3.css`, `file3.min.css`],
		},
		{
			args: {include: /.css$/, exclude: /.min.css$/},
			length: 2,
			files: [`file3.css`, `_file3.css`],
		},
		{
			args: {include: /.css$/, exclude: [/^_/, /.min.css$/]},
			length: 1,
			files: [`file3.css`],
		},
		{
			args: {include: [/.css$/, /.js$/]},
			length: 5,
			files: [`file2.js`, `file2.min.js`, `file3.css`, `_file3.css`, `file3.min.css`],
		},
		{
			args: {include: [/.css$/, /.js$/], exclude: /^_/},
			length: 4,
			files: [`file2.js`, `file2.min.js`, `file3.css`, `file3.min.css`],
		},
		{
			args: {include: [/.css$/, /.js$/], exclude: [/^_/, /.min.js$/]},
			length: 3,
			files: [`file2.js`, `file3.css`, `file3.min.css`],
		},
		{
			args: {exclude: /^_/},
			length: 6,
			files: [`file1.txt`, `file2.js`, `file2.min.js`, `file3.css`, `file3.min.css`, `file4.txt`],
		},
		{
			args: {exclude: [/^_/, /.txt$/]},
			length: 4,
			files: [`file2.js`, `file2.min.js`, `file3.css`, `file3.min.css`],
		},
	])(
		`should remove files from the destDir that are not in the srcDir`,
		async ({args, length, files}) => {
			await cleanUpAssets(srcDir, destDir, args);

			const destContents = await getDirContents(destDir);

			expect(destContents.length).toBe(length);
			files.forEach(file => {
				expect(destContents.includes(file)).toBeTruthy();
			});
		}
	);

	test(`should only leave '.min.' files if args.minified is true`, async () => {
		const srcDir1 = `${cwd}/cleanUpAssetsSrc1`;

		// Setup test directory
		await setUpTestDir(srcDir1, [
			`file1.txt`,
			`_file1.txt`,
			`file2.js`,
			`file3.css`,
			`_file3.css`,
			`file4.txt`,
		]);

		await cleanUpAssets(srcDir1, destDir, {include: [/.css$/, /.js$/], minified: true});

		const destContents = await getDirContents(destDir);

		expect(destContents.length).toBe(2);
		[`file2.min.js`, `file3.min.css`].forEach(file => {
			expect(destContents.includes(file)).toBeTruthy();
		});

		// Tear down test directory
		await teardownTestDir(srcDir1);
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
		`should throw an error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(arg)).rejects.toThrow(TypeError(`$srcDir must be a string!`));
		}
	);

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
			TypeError(`$args must be an object or null!`)
		);
	});

	// args.include and args.exclude accept regex, regex[], and null and cannot be type tested.

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each([
		{dir: srcDir, length: 0},
		{dir: srcDir1, length: 8},
		{dir: srcDir2, length: 10},
	])(`should return an array of $dir contents`, async ({dir, length}) => {
		const dirContents = await getDirContents(dir);
		expect.assertions(2);
		expect(is.array(dirContents)).toBeTruthy();
		expect(dirContents.length).toBe(length);
	});

	// ######## inclusion ########
	test.each([
		{dir: srcDir3, args: {include: /^_/}, length: 2, files: [`_file1.txt`, `_file3.css`]},
		{
			dir: srcDir3,
			args: {include: [/^_/, /^file2/]},
			length: 4,
			files: [`_file1.txt`, `_file3.css`, `file2.js`, `file2.min.js`],
		},
	])(`should only return $files with $args`, async ({dir, args, length, files}) => {
		const dirContents = await getDirContents(dir, args);
		expect.assertions();
		expect(is.array(dirContents)).toBeTruthy();
		expect(dirContents.length).toBe(length);
		files.forEach(file => {
			expect(dirContents.includes(file)).toBeTruthy();
		});
	});

	// ######## exclusion ########
	test.each([
		{
			dir: srcDir3,
			args: {exclude: /^_/},
			length: 7,
			files: [
				`file1.txt`,
				`file2.js`,
				`file2.min.js`,
				`file3.css`,
				`file3.min.css`,
				`file4.txt`,
				`aDirectory`,
			],
		},
		{
			dir: srcDir3,
			args: {exclude: [/^_/, /^file2/]},
			length: 5,
			files: [`file1.txt`, `file3.css`, `file3.min.css`, `file4.txt`, `aDirectory`],
		},
	])(`should only return $files with $args`, async ({dir, args, length, files}) => {
		const dirContents = await getDirContents(dir, args);
		expect.assertions();
		expect(dirContents.length).toBe(length);
		files.forEach(file => {
			expect(dirContents.includes(file)).toBeTruthy();
		});
	});

	// ######## inclusion and exclusion filtering ########
	test.each([
		{
			dir: srcDir3,
			args: {include: /file/, exclude: /^_/},
			length: 6,
			files: [`file1.txt`, `file2.js`, `file2.min.js`, `file3.css`, `file3.min.css`, `file4.txt`],
		},
		{
			dir: srcDir3,
			args: {include: /file/, exclude: [/^_/, /.css$/]},
			length: 4,
			files: [`file1.txt`, `file2.js`, `file2.min.js`, `file4.txt`],
		},
		{
			dir: srcDir3,
			args: {include: [/1/, /4/], exclude: /^_/},
			length: 2,
			files: [`file1.txt`, `file4.txt`],
		},
		{
			dir: srcDir3,
			args: {include: [/1/, /2/], exclude: [/^_/, /.min.js/]},
			length: 2,
			files: [`file1.txt`, `file2.js`],
		},
	])(`should only return $files with $args`, async ({dir, args, length, files}) => {
		const dirContents = await getDirContents(dir, args);
		expect.assertions();
		expect(dirContents.length).toBe(length);
		files.forEach(file => {
			expect(dirContents.includes(file)).toBeTruthy();
		});
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
