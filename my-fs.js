/**
 * @package my-node-utils
 * my-fs.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.6.5
 *
 * Utility async functions that use fs.
 *
 * * cleanUpAssets(srcDir, destDir, args)
 * * copyDirContents(srcDir, destDir, args)
 * * createDirectory(dirPath)
 * * createFileDirectories(filePath, isDirPath = false)
 * * fileOrDirCheck(path)
 * * getDirContents(srcDir, args)
 */

const colors = require(`colors`);
const fs = require(`fs`);
const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Deletes destDir file if srcDir file does not exist.
 * @async
 * @param {string} srcDir Path to source directory.
 * @param {string} destDir Path to destination directory.
 * @param {?object} args Filtering arguments.
 * @param {?regex} args.include Files to include from check in srcDir.
 * @param {?regex} args.exclude Files to exclude from check in srcDir.
 * @param {?boolean} args.minified Will match minified files in the destDir to unminified files in the srcDir and only keep the minified files.
 */
async function cleanUpAssets(
	srcDir,
	destDir,
	args = {include: null, exclude: null, minified: false}
) {
	// ######## Argument Type Checks ########
	/* srcDir checked in getDirContents */
	/* destDir checked in getDirContents */

	if (!is.objectOrNull(args)) {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	let minified = false;
	if (is.objectWithProperty(args, `minified`)) {
		if (is.boolean(args.minified)) {
			minified = args.minified;
		} else {
			throw message.typeError.boolean(`args.minified`);
		}
	}

	// ######## Functionality ########
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
				// Delete file if it is not .min.
				fs.unlinkSync(`${destDir}/${file}`);
			}
		} else if (!srcFiles.includes(file)) {
			fs.unlinkSync(`${destDir}/${file}`);
		}
	}
}
module.exports.cleanUpAssets = cleanUpAssets;

/**
 * Copies the contents of srcDir to destDir.
 * Creates destDir if it does not exist.
 * @async
 * @param {string} srcDir Path of source directory.
 * @param {string} destDir Path of destination directory.
 * @param {?object} args Used for filtering and more.
 * @param {?regex} args.include Files to include from check in srcDir.
 * @param {?regex} args.exclude Files to exclude from check in srcDir.
 * @param {?boolean} args.mirror Makes destDir mirror srcDir.
 * @param {?boolean} args.overwrite Overwrite file in destDir if it exists.
 */
async function copyDirContents(srcDir, destDir, args = null) {
	// ######## Argument Type Checks ########
	/* srcDir checked with getDirContents */
	/* destDir checked with getDirContents */

	let mirror = false;
	let overwrite = false;

	if (is.objectOrNull(args)) {
		if (is.objectWithProperty(args, `mirror`)) {
			if (is.boolean(args.mirror)) {
				mirror = args.mirror;
			} else {
				throw message.typeError.isNotBoolean(`args.mirror`);
			}
		}

		if (is.objectWithProperty(args, `overwrite`)) {
			if (is.boolean(args.overwrite)) {
				overwrite = args.overwrite;
			} else {
				throw message.typeError.isNotBoolean(`args.overwrite`);
			}
		}
	} else {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	// ***** destDir *****
	if (is.string(destDir)) {
		const destDirType = await fileOrDirCheck(destDir);

		if (destDirType === `isFile`) {
			throw Error(`$destDir ${destDirType}!`);
		}

		if (fs.existsSync(destDir) && mirror) {
			fs.rmSync(destDir, {recursive: true, force: true});
		}

		createDirectory(destDir);
	} else {
		throw message.typeError.isNotString(`destDir`);
	}

	// ######## Functionality ########
	const contents = await getDirContents(srcDir, args);

	for (const file of contents) {
		if (!fs.existsSync(`${destDir}/${file}`) || overwrite) {
			fs.copyFileSync(`${srcDir}/${file}`, `${destDir}/${file}`);
		}
	}
}
module.exports.copyDirContents = copyDirContents;

/**
 * Creates the directory if it doesn't already exist.
 * @async
 * @param {string} dirPath Path of Directory
 */
async function createDirectory(dirPath) {
	// ######## Argument Type Check ########

	// ######## Functionality ########
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
 * @param {boolean} isDirPath If the path is to a directory.
 */
async function createFileDirectories(filePath, isDirPath = false) {
	// ######## Argument Type Checks ########

	// ######## Functionality ########
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
	// ######## Argument Type Checks ########
	if (!is.string(path)) {
		throw message.typeError.isNotString(`path`);
	}

	// ######## Functionality ########
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
 * @param {?object} args File suffix to only get certain files.
 * @param {?regex} args.include Files to include from check in srcDir.
 * @param {?regex} args.exclude Files to exclude from check in srcDir.
 * @param {?string} args.dirArgName Name of srcDir to use for error reporting.
 * @returns {Promise<array>} Array of directory contents.
 */
async function getDirContents(srcDir, args = {include: null, exclude: null, dirArgName: null}) {
	// ######## Argument type checks ########
	if (!is.objectOrNull(args)) {
		throw TypeError(`$args must be an object or null!`);
	}

	let dirName = `srcDir`;
	if (is.objectWithProperty(args, `dirArgName`) && args.dirArgName !== null) {
		if (is.string(args.dirArgName)) {
			dirName = args.dirArgName;
		} else {
			throw message.typeError.isNotStringOrNull(`args.dirArgName`);
		}
	}

	if (is.string(srcDir)) {
		const srcDirType = await fileOrDirCheck(srcDir);

		if (srcDirType === `doesNotExist` || srcDirType === `isFile`) {
			throw Error(`$${dirName} ${srcDirType}!`);
		}
	} else {
		throw message.typeError.isNotString(dirName);
	}

	// ######## Functionality ########
	const contents = fs.readdirSync(srcDir);

	// Skip filtering if no contents
	if (!contents || !contents.length) {
		return [];
	}

	// ***** Apply Filtering *****
	let filtered = [];

	// --- Apply inclusion filters ---
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

	// --- Apply exclusion filters ---
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
