/**
 * @package my-node-utils
 * my-fs.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-fs.js
 */

const {cleanUpAssets, copyDirContents, getDirContents, fileOrDirCheck} = require(`./../my-fs`);
const fs = require(`fs`);
const is = require(`./../my-bools`);
const message = require(`./../my-messages`);
const testData = require(`./test-data/type-testing`);
const {assert} = require("console");

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
	test.each(testData.type.isNotString)(
		`should throw an error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(arg, destDir)).rejects.toThrow(
				TypeError(`$srcDir must be a string!`)
			);
		}
	);

	// ######## destDir failing ########
	test.each(testData.type.isNotString)(
		`should throw an error if destDir is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, arg)).rejects.toThrow(
				TypeError(`$destDir must be a string!`)
			);
		}
	);

	// ######## args ########
	test.each(testData.type.isObjectOrNull)(
		`should not throw an error if args is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, arg)).resolves.not.toThrowError();
		}
	);

	test.each(testData.type.isNotObjectOrNull)(
		`should throw an error if args is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, arg)).rejects.toThrow(
				TypeError(`$args must be an object or null!`)
			);
		}
	);

	// ######## args.minified ########
	test.each(testData.type.isBoolean)(
		`should not throw error if args.minified is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, {minified: true})).resolves.not.toThrowError();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if args.minified is $type`,
		async ({type, arg}) => {
			await expect(cleanUpAssets(srcDir, destDir, {minified: arg})).rejects.toThrowError();
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	// TODO: throw errors is dirs do not exist or are files.
	test(`should throw error if srcDir does not exist`, async () => {
		await expect(cleanUpAssets(`${srcDir}doesntexist`, destDir)).rejects.toThrow(
			`$srcDir doesNotExist!`
		);
	});

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
//     srcDir,
//     destDir,
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

	// ------------------------------
	// Argument Types
	// ------------------------------
	// ######## srcDir ########
	test(`should not throw error if srcDir is a string`, async () => {
		await expect(copyDirContents(srcDir, destDir)).resolves.not.toThrowError();
	});

	test.each(testData.type.isNotString)(
		`should throw error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(arg, destDir)).rejects.toThrow(
				TypeError(`$srcDir must be a string!`)
			);
		}
	);

	// ######## destDir ########
	test(`should not throw error if destDir is a string`, async () => {
		await expect(copyDirContents(srcDir, destDir)).resolves.not.toThrowError();
	});

	test.each(testData.type.isNotString)(
		`should throw error if destDir is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, arg)).rejects.toThrow(
				TypeError(`$destDir must be a string!`)
			);
		}
	);

	// ######## args ########
	test.each(testData.type.isObjectOrNull)(
		`should not throw error if args is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, arg)).resolves.not.toThrowError();
		}
	);

	test.each(testData.type.isNotObjectOrNull)(
		`should throw error if args is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, arg)).rejects.toThrow(
				TypeError(`$args must be an object or null!`)
			);
		}
	);

	// TODO: Test certain arg types as they come up.

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should throw an error if srcDir does not exist`, async () => {
		await expect(copyDirContents(`${srcDir}doesnotexist`, destDir)).rejects.toThrow(
			Error(`$srcDir doesNotExist!`)
		);
	});

	test(`should throw an error if srcDir is a file`, async () => {
		fs.writeFileSync(`${srcDir}/isFile`, ``);
		await expect(copyDirContents(`${srcDir}/isFile`, destDir)).rejects.toThrow(
			Error(`$srcDir isFile!`)
		);
	});

	test(`should create destDir if it does not exist`, async () => {
		await copyDirContents(srcDir, destDir);
		expect(fs.existsSync(destDir)).toBeTruthy();
	});

	test(`should throw an error if destDir is a file`, async () => {
		fs.writeFileSync(`${srcDir}/isFile`, ``);
		await expect(copyDirContents(srcDir, `${srcDir}/isFile`)).rejects.toThrow(
			Error(`$destDir isFile!`)
		);
	});

	test(`should copy the contents of the srcDir to the destDir`, async () => {
		await copyDirContents(srcDir, destDir);

		const destContents = await getDirContents(destDir);

		expect(destContents.length).toBe(8);
		dirOneFiles.forEach(file => {
			expect(destContents.includes(file)).toBeTruthy();
		});

		// TODO: Copy all of the regex from getDirContents args to test filtering.

		// TODO: Test that files that aren't in srcDir won't be deleted.

		// TODO: Test arg to overwrite or ignore existing file.

		// TODO: Test arg to mirror srcDir.
	});
	// TODO: Finish the describe
});

// ****************************************
// async function getDirContents(
//     srcDir,
//     args = {
//         include: null,
//         exclude: null,
//         dirArgName: null,
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
	// ######## srcDir ########
	test(`should not throw error if srcDir is a string`, async () => {
		await expect(getDirContents(srcDir)).resolves.not.toThrowError();
	});

	test.each(testData.type.isNotString)(
		`should throw an error if srcDir is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(arg)).rejects.toThrow(TypeError(`$srcDir must be a string!`));
		}
	);

	// ######## args ########
	test.each(testData.type.isObjectOrNull)(
		`should not throw error if args is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(srcDir, arg)).resolves.not.toThrowError();
		}
	);

	test.each(testData.type.isNotObjectOrNull)(
		`should throw an error if args is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(srcDir, arg)).rejects.toThrow(
				TypeError(`$args must be an object or null!`)
			);
		}
	);

	// ***** args.dirArgName *****
	test.each(testData.type.isNotStringOrNull)(
		`should throw error if args.dirArgName is $type`,
		async ({type, arg}) => {
			await expect(getDirContents(123, {dirArgName: arg})).rejects.toThrow(
				TypeError(`$args.dirArgName must be a string or null!`)
			);
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should throw error if srcDir doesn't exist`, async () => {
		await expect(getDirContents(`${srcDir}doesNotExist`)).rejects.toThrow(`$srcDir doesNotExist!`);
	});

	test(`should throw custom error if args.dirArgName is a string`, async () => {
		await expect(getDirContents(123, {dirArgName: `theDir`})).rejects.toThrow(
			TypeError(`$theDir must be a string!`)
		);
	});
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

// ****************************************
// fileOrDirCheck(path)
// ****************************************
describe(`fileOrDirCheck`, () => {
	const dir = `${cwd}/fileOrDirCheckDir`;
	const file = `${cwd}/fileOrDirCheckFile`;
	const doesntExist = `${cwd}/doesntexist`;

	beforeAll(async () => {
		await setUpTestDir(dir);
		fs.writeFileSync(file, ``);
	});

	afterAll(async () => {
		await teardownTestDir(dir);
		await teardownTestDir(file);
	});

	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if path is a string`, async () => {
		await expect(fileOrDirCheck(dir)).resolves.not.toThrowError();
	});

	test.each(testData.type.isNotString)(
		`should throw error if path is $type`,
		async ({type, arg}) => {
			await expect(fileOrDirCheck(arg)).rejects.toThrow(TypeError(`$path must be a string!`));
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each([
		{path: dir, expected: `isDirectory`},
		{path: file, expected: `isFile`},
		{path: doesntExist, expected: `doesNotExist`},
	])(`should return $expected if path is $path`, async ({path, expected}) => {
		const result = await fileOrDirCheck(path);
		expect(result).toBe(expected);
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
