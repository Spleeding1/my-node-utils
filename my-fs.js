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

/**
 * Deletes output file if src file does not exist. Bypasses src files that start with `_`. Removes
 * file extension to account for `*.min.*` files.
 * @async
 * @param {string} outputFilesDir Path to output files.
 * @param {string} srcFilesDir Path to source files.
 * @param {?string} extension File extension of files.
 */
async function cleanUpAssets(destDir, srcDir, fileExt = null) {
	if (!is.string(destDir)) {
		throw TypeError(`destDir must be a string`);
	}
	if (!is.string(srcDir)) {
		throw TypeError(`srcDir must be a string`);
	}
	// if (fileExt && ) {

	// }

	const destFiles = await getDirContents(destDir, fileExt);
	const srcFiles = await getDirContents(srcDir, fileExt);
	let srcString = ``;

	srcFiles.forEach(fileName => {
		if (!fileName.startsWith(`_`)) {
			srcString = `${srcString}, ${fileName}`;
		}
	});

	for await (const file of destFiles) {
		if (!file.endsWith(fileExt)) {
			continue;
		}
		const fileName = `${file.split(`.`)[0]}${fileExt}`;
		if (srcString.includes(fileName)) {
			continue;
		}

		fs.unlinkSync(`${destDir}/${file}`);
	}
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
 */
async function getDirContents(
	srcDir,
	args = {include: {prefix: null, suffix: null}, exclude: {prefix: null, suffix: null}}
) {
	let includePrefix = null;
	let includeSuffix = null;
	let excludePrefix = null;
	let excludeSuffix = null;

	if (!is.string(srcDir)) {
		throw TypeError(`srcDir must be a string`);
	}

	if (!is.objectOrNull(args)) {
		throw TypeError(`args must be an object or null`);
	}

	// ***** Filter contents: inclusions *****
	if (is.objectWithProperty(args, `include`)) {
		if (is.objectOrNull(args.include)) {
			if (is.objectWithProperty(args.include, `prefix`)) {
				if (is.nullStringOrArray(args.include.prefix)) {
					if (is.array(args.include.prefix) && !is.arrayOfStrings(args.include.prefix)) {
						throw TypeError(`args.include.prefix must be a string or an string[] or null`);
					}
				} else {
					throw TypeError(`args.include.prefix must be a string or an string[] or null`);
				}
			}

			if (is.objectWithProperty(args.include, `suffix`)) {
				if (is.nullStringOrArray(args.include.suffix)) {
					if (is.array(args.include.suffix) && !is.arrayOfStrings(args.include.suffix)) {
						throw TypeError(`args.include.suffix must be a string or an string[] or null`);
					}
				} else {
					throw TypeError(`args.include.suffix must be a string or an string[] or null`);
				}
			}
		} else {
			throw TypeError(`args.include must be an object or null`);
		}
	}

	// ***** Filter contents: exclusions *****
	if (is.objectWithProperty(args, `exclude`)) {
		if (is.objectOrNull(args.exclude)) {
			if (is.objectWithProperty(args.exclude, `prefix`)) {
				if (is.nullStringOrArray(args.exclude.prefix)) {
					if (is.array(args.exclude.prefix) && !is.arrayOfStrings(args.exclude.prefix)) {
						throw TypeError(`args.exclude.prefix must be a string or an string[] or null`);
					}
				} else {
					throw TypeError(`args.exclude.prefix must be a string or an string[] or null`);
				}
			}

			if (is.objectWithProperty(args.exclude, `suffix`)) {
				if (is.nullStringOrArray(args.exclude.suffix)) {
					if (is.array(args.exclude.suffix) && !is.arrayOfStrings(args.exclude.suffix)) {
						throw TypeError(`args.exclude.suffix must be a string or an string[] or null`);
					}
				} else {
					throw TypeError(`args.exclude.suffix must be a string or an string[] or null`);
				}
			}
		} else {
			throw TypeError(`args.exclude must be an object or null`);
		}
	}

	const contents = fs.readdirSync(srcDir);

	// Exit if no contents
	// if (!contents || !contents.length) {
	// 	return [];
	// }

	// if (exclude) {
	// 	let selectedFiles = [];

	// 	for await (const item of contents) {
	// 		if (item.endsWith(exclude)) {
	// 			selectedFiles.push(item);
	// 		}
	// 	}

	// 	return selectedFiles;
	// } else {
	return contents;
	// }
}

module.exports.getDirContents = getDirContents;
