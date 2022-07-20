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
async function cleanUpAssets(srcDir, destDir, args = {include: null, exclude: null}) {
	if (!is.string(srcDir)) {
		throw message.typeError.string(`srcDir`);
	}
	if (!is.string(destDir)) {
		throw message.typeError.string(`destDir`);
	}
	// if (fileExt && ) {

	// }

	// const destFiles = await getDirContents(destDir, fileExt);
	// const srcFiles = await getDirContents(srcDir, fileExt);
	let srcString = ``;

	// srcFiles.forEach(fileName => {
	// 	if (!fileName.startsWith(`_`)) {
	// 		srcString = `${srcString}, ${fileName}`;
	// 	}
	// });

	// for await (const file of destFiles) {
	// 	if (!file.endsWith(fileExt)) {
	// 		continue;
	// 	}
	// 	const fileName = `${file.split(`.`)[0]}${fileExt}`;
	// 	if (srcString.includes(fileName)) {
	// 		continue;
	// 	}

	// 	fs.unlinkSync(`${destDir}/${file}`);
	// }
}

module.exports.cleanUpAssets = cleanUpAssets;

/**
 * Copies the contents of one directory to another.
 * @async
 * @param {string} sourceDir Path of source directory.
 * @param {string} targetDir Path of target directory.
 * @param {?string} fileSuffix Used if targeting specific file types.
 * @returns {Promise<void>} If an error occurs.
 */
async function copyDirContents(sourceDir, targetDir, fileSuffix = null) {
	if (fileOrDirCheck(sourceDir) !== `isDirectory` || fileOrDirCheck(targetDir) !== `isDirectory`) {
		return;
	}
	const contents = await getDirContents(sourceDir, fileSuffix);

	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, err => {
			if (err) {
				console.error(err.brightRed);
				return;
			}
		});
	}

	for (const file of contents) {
		if (fileSuffix) {
			if (file.endsWith(fileSuffix)) {
				console.info(file.yellow);
				fs.copyFileSync(`${sourceDir}/${file}`, `${targetDir}/${file}`, err => {
					if (err) {
						console.error(err.brightRed);
						return;
					}
				});
			}
		} else {
			console.info(file.yellow);
			fs.copyFileSync(`${sourceDir}/${file}`, `${targetDir}/${file}`, err => {
				if (err) {
					console.error(err.brightRed);
					return;
				}
			});
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
	let result = `neither`;
	try {
		const stat = fs.lstatSync(path);
		if (stat.isFile()) {
			result = `isFile`;
		} else if (stat.isDirectory()) {
			result = `isDirectory`;
		}
		console.info(`${result}: ${path}`.gray);
		return result;
	} catch (e) {
		console.error(`${e}\n${path}`.brightRed);
		return `error`;
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
async function getDirContents(srcDir, args = {include: null, exclude: null}) {
	// ------------------------------
	// Argument type checks
	// ------------------------------
	if (!is.string(srcDir)) {
		throw message.typeError.string(`srcDir`);
	}

	if (!is.objectOrNull(args)) {
		throw TypeError(`args must be an object or null`);
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
