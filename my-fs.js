/**
 * @package my-node-utils
 * my-fs.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.6.4
 *
 * Utility async functions that use fs.
 *
 * * cleanUpAssets(outputFilesDir, srcFilesDir, extension)
 * * copyDirContents(sourceDir, targetDir, fileSuffix = null)
 * * createDirectory(dirPath)
 * * createFileDirectories(filePath, isDirPath = false)
 * * fileOrDirCheck(path)
 * * getDirContents(path, fileSuffix = null)
 */

const colors = require(`colors`);
const fs = require(`fs`);
const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Deletes output file if src file does not exist. Bypasses src files that start with `_`. Removes
 * file extension to account for `*.min.*` files.
 * @async
 * @param {string} outputFilesDir Path to output files.
 * @param {string} srcFilesDir Path to source files.
 * @param {?string} extension File extension of files.
 */
async function cleanUpAssets(
	srcDir,
	destDir,
	args = {include: null, exclude: null, minified: false}
) {
	let minified = false;
	// ------------------------------
	// Argument Type Checks
	// ------------------------------

	/* srcDir checked in getDirContents */

	/* destDir checked in getDirContents */

	if (!is.objectOrNull(args)) {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	if (is.objectWithProperty(args, `minified`)) {
		if (is.boolean(args.minified)) {
			minified = args.minified;
		} else {
			throw message.typeError.boolean(`args.minified`);
		}
	}

	const srcFiles = await getDirContents(srcDir, args);

	const destFiles = await getDirContents(destDir, {dirArgName: `destDir`});

	for await (const file of destFiles) {
		if (minified) {
			if (file.includes(`.min.`)) {
				const fileMod = file.replace(`.min.`, `.`);
				if (!srcFiles.includes(fileMod)) {
					fs.unlinkSync(`${destDir}/${file}`);
				}
			} else {
				fs.unlinkSync(`${destDir}/${file}`);
			}
		} else if (!srcFiles.includes(file)) {
			fs.unlinkSync(`${destDir}/${file}`);
		}
	}
}

module.exports.cleanUpAssets = cleanUpAssets;

// TODO: fix documentation anf complete fucntion
/**
 * Copies the contents of one directory to another.
 * @async
 * @param {string} sourceDir Path of source directory.
 * @param {string} targetDir Path of target directory.
 * @param {?string} fileSuffix Used if targeting specific file types.
 * @returns {Promise<void>} If an error occurs.
 */
async function copyDirContents(srcDir, destDir, args = null) {
	if (is.string(srcDir)) {
		const srcDirType = await fileOrDirCheck(srcDir);

		if (srcDirType === `isFile` || srcDirType === `doesNotExist`) {
			throw Error(`$srcDir ${srcDirType}!`);
		}
	} else {
		throw message.typeError.isNotString(`srcDir`);
	}

	if (is.string(destDir)) {
		const destDirType = await fileOrDirCheck(destDir);

		if (destDirType === `isFile`) {
			throw Error(`$destDir ${destDirType}!`);
		}
		createDirectory(destDir);
	} else {
		throw message.typeError.isNotString(`destDir`);
	}

	if (!is.objectOrNull(args)) {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	const contents = await getDirContents(srcDir);

	for (const file of contents) {
		fs.copyFileSync(`${srcDir}/${file}`, `${destDir}/${file}`);
	}
}

module.exports.copyDirContents = copyDirContents;

/**
 * Creates the directory if it doesn't already exist.
 * @async
 * @param {string} dirPath Path of Directory
 */
async function createDirectory(dirPath) {
	try {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
			console.info(`created ${dirPath}`.gray);
		}
	} catch (err) {
		console.error(err.brightRed);
	}
}

module.exports.createDirectory = createDirectory;

/**
 * Creates all of the directories from the given path.
 * @async
 * @param {string} filePath Path of file destination.
 * @param {bool} isDirPath If the path is to a directory.
 */
async function createFileDirectories(filePath, isDirPath = false) {
	const splitFilePath = filePath.split(`/`);

	if (splitFilePath.length > 1) {
		const totalDirectories = isDirPath ? splitFilePath.length : splitFilePath.length - 1;
		let currentDir = ``;
		for (let d = 0; d < totalDirectories; d++) {
			currentDir += `/${splitFilePath[d]}`;
			await createDirectory(currentDir);
		}
	}
}

module.exports.createFileDirectories = createFileDirectories;

/**
 * Checks a path for isFile() and isDirectory().
 * @async
 * @param {string} path Path of file or directory.
 * @returns {Promise<string>} The result of the check.
 */
async function fileOrDirCheck(path) {
	if (!is.string(path)) {
		throw message.typeError.isNotString(`path`);
	}

	if (fs.existsSync(path)) {
		const stat = fs.lstatSync(path);

		if (stat.isFile()) {
			return `isFile`;
		} else if (stat.isDirectory()) {
			return `isDirectory`;
		}
	} else {
		return `doesNotExist`;
	}
}

module.exports.fileOrDirCheck = fileOrDirCheck;

/**
 * Gets the contents of a directory.
 * @async
 * @param {string} srcDir Directory path.
 * @param {object?} args File suffix to only get certain files.
 * @returns {Promise<array>} Array of directory contents.
 * @throws {TypeError} If $srcDir or $args is an incorrect type.
 */
async function getDirContents(srcDir, args = {include: null, exclude: null, dirArgName: null}) {
	// ------------------------------
	// Argument type checks
	// ------------------------------
	if (!is.objectOrNull(args)) {
		throw TypeError(`$args must be an object or null!`);
	}

	if (is.string(srcDir)) {
		const srcDirType = await fileOrDirCheck(srcDir);

		if (srcDirType === `doesNotExist`) {
			throw Error(`$srcDir ${srcDirType}!`);
		}
	} else {
		if (is.objectWithProperty(args, `dirArgName`) && args.dirArgName !== null) {
			if (is.string(args.dirArgName)) {
				throw message.typeError.isNotString(args.dirArgName);
			} else {
				throw message.typeError.isNotStringOrNull(`args.dirArgName`);
			}
		} else {
			throw message.typeError.isNotString(`srcDir`);
		}
	}

	// ------------------------------
	// Get dir contents
	// ------------------------------
	const contents = fs.readdirSync(srcDir);

	// Skip filtering if no contents
	if (!contents || !contents.length) {
		return [];
	}

	// ------------------------------
	// Apply filters to contents
	// ------------------------------
	let filtered = [];

	// ######## Apply inclusion filters ########
	if (is.objectWithProperty(args, `include`) && args.include !== null) {
		if (is.array(args.include)) {
			for await (const regex of args.include) {
				filtered = filtered.concat(contents.filter(file => file.match(regex)));
			}
		} else {
			filtered = filtered.concat(contents.filter(file => file.match(args.include)));
		}
	} else {
		filtered = contents;
	}

	// ######## Apply exclusion filters ########
	if (is.objectWithProperty(args, `exclude`) && args.exclude !== null) {
		if (is.array(args.exclude)) {
			for await (const regex of args.exclude) {
				filtered = filtered.filter(file => !file.match(regex));
			}
		} else {
			filtered = filtered.filter(file => !file.match(args.exclude));
		}
	}
	return filtered;
}

module.exports.getDirContents = getDirContents;
