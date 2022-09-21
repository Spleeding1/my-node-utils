/**
 * @package my-node-utils
 * my-fs.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-fs.js
 */

const {
	cleanUpAssets,
	copyDirContents,
	getDirContents,
	fileOrDirCheck,
	createDirectory,
	createFileDirectories,
} = require(`./../my-fs`);
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
	const aFile = `${cwd}/cleanUpAssetsAFile`;

	beforeAll(async () => {
		await setUpTestDir(srcDir, dirOneFiles);
		fs.writeFileSync(aFile, ``);
	});

	beforeEach(async () => {
		await setUpTestDir(destDir, dirTwoFiles);
	});

	afterEach(async () => {
		await teardownTestDir(destDir);
	});

	afterAll(async () => {
		await teardownTestDir(srcDir);
		await teardownTestDir(destDir);
		await teardownTestDir(aFile);
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
	test(`should throw error if srcDir does not exist`, async () => {
		await expect(cleanUpAssets(`${srcDir}doesntexist`, destDir)).rejects.toThrow(
			`$srcDir doesNotExist!`
		);
	});

	test(`should throw error if srcDir is a file`, async () => {
		await expect(cleanUpAssets(aFile, destDir)).rejects.toThrow(`$srcDir isFile!`);
	});

	test(`should throw error if destDir does not exist`, async () => {
		await expect(cleanUpAssets(srcDir, `${destDir}doesntexist`)).rejects.toThrow(
			`$destDir doesNotExist!`
		);
	});

	test(`should throw error if destDir is a file`, async () => {
		await expect(cleanUpAssets(srcDir, aFile)).rejects.toThrow(`$destDir isFile!`);
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
	const srcDir1 = `${cwd}/copyDirContentsSrc1`;
	const srcDir2 = `${cwd}/copyDirContentsSrc2`;
	const srcDir3 = `${cwd}/copyDirContentsSrc3`;
	const srcDir4 = `${cwd}/copyDirContentsSrc4`;
	const destDir = `${cwd}/copyDirContentsDest`;
	const aFile = `${cwd}/copyDirContentsAfile`;

	beforeAll(async () => {
		await setUpTestDir(srcDir, dirOneFiles);
		await setUpTestDir(srcDir1, dirOneFiles);
		await setUpTestDir(srcDir2, dirTwoFiles);
		await setUpTestDir(srcDir3, dirThreeFiles);
		await setUpTestDir(srcDir4, dirFourFiles);
		fs.writeFileSync(aFile, ``);
	});

	afterEach(async () => {
		await teardownTestDir(destDir);
	});

	afterAll(async () => {
		await teardownTestDir(srcDir);
		await teardownTestDir(srcDir1);
		await teardownTestDir(srcDir2);
		await teardownTestDir(srcDir3);
		await teardownTestDir(srcDir4);
		await teardownTestDir(destDir);
		await teardownTestDir(aFile);
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

	// ***** args.overwrite *****
	test.each(testData.type.isBoolean)(
		`should not throw error if args.overwrite is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, {overwrite: arg})).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if args.overwrite is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, {overwrite: arg})).rejects.toThrow(
				TypeError(`$args.overwrite must be true or false!`)
			);
		}
	);

	// ***** args.mirror *****
	test.each(testData.type.isBoolean)(
		`should not throw error if args.mirror is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, {mirror: arg})).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if args.mirror is $type`,
		async ({type, arg}) => {
			await expect(copyDirContents(srcDir, destDir, {mirror: arg})).rejects.toThrow();
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should throw an error if srcDir does not exist`, async () => {
		await expect(copyDirContents(`${srcDir}doesnotexist`, destDir)).rejects.toThrow(
			Error(`$srcDir doesNotExist!`)
		);
	});

	test(`should throw an error if srcDir is a file`, async () => {
		await expect(copyDirContents(aFile, destDir)).rejects.toThrow(Error(`$srcDir isFile!`));
	});

	test(`should create destDir if it does not exist`, async () => {
		await copyDirContents(srcDir, destDir);
		expect(fs.existsSync(destDir)).toBeTruthy();
	});

	test(`should throw an error if destDir is a file`, async () => {
		await expect(copyDirContents(srcDir, aFile)).rejects.toThrow(Error(`$destDir isFile!`));
	});

	test(`should copy the contents of the srcDir to the destDir`, async () => {
		await copyDirContents(srcDir, destDir);

		const destContents = await getDirContents(destDir);

		expect(destContents.length).toBe(8);
		dirOneFiles.forEach(file => {
			expect(destContents.includes(file)).toBeTruthy();
		});
	});

	test.each([
		{dir: srcDir1, length: 8},
		{dir: srcDir2, length: 10},
	])(`should copy $dir contents to the destDir`, async ({dir, length}) => {
		await copyDirContents(dir, destDir);

		const dirContents = await getDirContents(destDir);
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
	])(`should only copy $files with $args`, async ({dir, args, length, files}) => {
		await copyDirContents(dir, destDir, args);
		const dirContents = await getDirContents(destDir, args);

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
	])(`should copy return $files with $args`, async ({dir, args, length, files}) => {
		await copyDirContents(dir, destDir, args);
		const dirContents = await getDirContents(destDir, args);

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
	])(`should copy return $files with $args`, async ({dir, args, length, files}) => {
		await copyDirContents(dir, destDir, args);
		const dirContents = await getDirContents(destDir, args);

		expect(dirContents.length).toBe(length);
		files.forEach(file => {
			expect(dirContents.includes(file)).toBeTruthy();
		});
	});

	test(`should not delete files in destDir that are not in srcDir`, async () => {
		await setUpTestDir(destDir, [`saveMe.txt`]);
		await copyDirContents(srcDir, destDir);

		const contents = await getDirContents(destDir);
		expect(contents.includes(`saveMe.txt`));
		expect(contents.length > 1).toBeTruthy();
	});

	test(`should ignore existing files if args.overwrite is false`, async () => {
		await setUpTestDir(destDir, [`file1.txt`]);
		fs.writeFileSync(`${destDir}/file1.txt`, `Save Me.`);
		await copyDirContents(srcDir, destDir);
		const fileContents = fs.readFileSync(`${destDir}/file1.txt`, {encoding: `utf8`, flag: `r`});
		expect(fileContents).toBe(`Save Me.`);
	});

	test(`should overwrite existing files if args.overwrite is true`, async () => {
		await setUpTestDir(destDir, [`file1.txt`]);
		fs.writeFileSync(`${destDir}/file1.txt`, `overwrite me`);
		await copyDirContents(srcDir, destDir, {overwrite: true});
		const fileContents = fs.readFileSync(`${destDir}/file1.txt`, {encoding: `utf8`, flag: `r`});
		expect(fileContents).toBe(``);
	});

	test(`should make destDir mirror srcDir if args.mirror is true`, async () => {
		await setUpTestDir(destDir, [`file1.txt`, `extra-file.min.css`]);
		fs.writeFileSync(`${destDir}/file1.txt`, `overwrite me`);
		await copyDirContents(srcDir, destDir, {mirror: true});
		const fileContents = fs.readFileSync(`${destDir}/file1.txt`, {encoding: `utf8`, flag: `r`});
		expect(fileContents).toBe(``);
		expect(fs.existsSync(`${destDir}/extra-file.min.css`)).toBeFalsy();

		const destDirContents = await getDirContents(destDir);

		dirOneFiles.forEach(file => {
			expect(destDirContents.includes(file)).toBeTruthy();
		});
	});
});

// ****************************************
// async function createDirectory(dirPath)
// ****************************************
describe(`createDirectory(dirPath)`, () => {
	const dirPath = `${cwd}/createDirectory`;

	afterEach(async () => {
		teardownTestDir(dirPath);
	});

	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if dirPath is a string`, async () => {
		await expect(createDirectory(dirPath)).resolves.not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if dirPath is $type`,
		async ({type, arg}) => {
			await expect(createDirectory(arg)).rejects.toThrow(TypeError(`$dirPath must be a string!`));
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should create directory`, async () => {
		await createDirectory(dirPath);
		const result = await fileOrDirCheck(dirPath);
		expect(result).toBe(`isDirectory`);
	});

	test(`should not overwrite directory if it already exists`, async () => {
		await setUpTestDir(dirPath, [`file.txt`]);
		await createDirectory(dirPath);
		const dirContents = await getDirContents(dirPath);
		expect(dirContents.length > 0);
	});

	test(`should throw error if dirPath exists and is a file`, async () => {
		fs.writeFileSync(dirPath, ``);
		await expect(createDirectory(dirPath)).rejects.toThrow(Error(`$dirPath isFile!`));
	});
});

// TODO: createDirectories
// ****************************************
// async createFileDirectories(filePath, isDirPath)
// ****************************************
describe(`createFileDirectories`, () => {
	const topLevel = `${cwd}/createFileDirectories`;
	const levelTwo = `${cwd}/createFileDirectories/levelTwo`;
	const levelThree = `${cwd}/createFileDirectories/levelTwo/LevelThree`;
	const levelFour = `${cwd}/createFileDirectories/levelTwo/LevelThree/LevelFour`;

	afterEach(async () => {
		await teardownTestDir(topLevel);
	});

	// ------------------------------
	// Argument Types
	// ------------------------------
	test(`should not throw error if filePath is a string`, async () => {
		await expect(createFileDirectories(topLevel)).resolves.not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if filePath is $type`,
		async ({type, arg}) => {
			await expect(createFileDirectories(arg)).rejects.toThrow(
				TypeError(`$filePath must be a string!`)
			);
		}
	);

	test.each(testData.type.isBoolean)(
		`should not throw error if isDirPath is $type`,
		async ({type, arg}) => {
			await expect(createFileDirectories(topLevel, arg)).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotBoolean)(
		`should throw error if isDirPath is $type`,
		async ({type, arg}) => {
			await expect(createFileDirectories(topLevel, arg)).rejects.toThrow(
				TypeError(`$isDirPath must be true or false!`)
			);
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	test(`should create all of the missing directories for the file`, async () => {
		await createFileDirectories(`${levelFour}/file.txt`);
		expect(fs.existsSync(topLevel)).toBeTruthy();
		expect(fs.existsSync(levelTwo)).toBeTruthy();
		expect(fs.existsSync(levelThree)).toBeTruthy();
		expect(fs.existsSync(levelFour)).toBeTruthy();
		expect(fs.existsSync(`${levelFour}/file.txt`)).toBeFalsy();
	});

	test(`should create all of the missing directories for the directory`, async () => {
		await createFileDirectories(levelFour);
		expect(fs.existsSync(topLevel)).toBeTruthy();
		expect(fs.existsSync(levelTwo)).toBeTruthy();
		expect(fs.existsSync(levelThree)).toBeTruthy();
		expect(fs.existsSync(levelFour)).toBeFalsy();
	});
});

// ****************************************
// async fileOrDirCheck(path, pathArgName)
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

	test.each(testData.type.isStringOrNull)(
		`should not throw error if pathArgName is $type`,
		async ({type, arg}) => {
			await expect(fileOrDirCheck(dir, arg)).resolves.not.toThrow();
		}
	);

	test.each(testData.type.isNotStringOrNull)(
		`should throw error if pathArgName is $type`,
		async ({type, arg}) => {
			await expect(fileOrDirCheck(dir, arg)).rejects.toThrow(
				TypeError(`$pathArgName must be a string or null!`)
			);
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

	test(`should use pathArgName for path string error when given`, async () => {
		await expect(fileOrDirCheck(123, `myDir`)).rejects.toThrow(
			TypeError(`$myDir must be a string!`)
		);
	});
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
	const aFile = `${cwd}/getDirContentsAFile`;

	beforeAll(async () => {
		await setUpTestDir(srcDir);
		await setUpTestDir(srcDir1, dirOneFiles);
		await setUpTestDir(srcDir2, dirTwoFiles);
		await setUpTestDir(srcDir3, dirThreeFiles);
		await setUpTestDir(srcDir4, dirFourFiles);
		fs.writeFileSync(aFile, ``);
	});

	afterAll(async () => {
		await teardownTestDir(srcDir);
		await teardownTestDir(srcDir1);
		await teardownTestDir(srcDir2);
		await teardownTestDir(srcDir3);
		await teardownTestDir(srcDir4);
		await teardownTestDir(aFile);
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

	test(`should throw error if srcDir is a file`, async () => {
		await expect(getDirContents(aFile)).rejects.toThrow(`$srcDir isFile!`);
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
