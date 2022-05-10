/**
 * @package node_packages
 * my-fs.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.0.0
 *
 * Utility async functions that use fs.
 *
 * * createDirectory(dirPath)
 * * createFileDirectories(filePath, isDirPath = false)
 * * fileOrDirCheck(path)
 */

const colors = require(`colors`);
const fs = require(`fs`);

/**
 * Copies the contents of one directory to another.
 * @async
 * @param {string} sourceDir Path of source directory.
 * @param {string} targetDir Path of target directory.
 * @param {string} fileSuffix Used if targeting specific file types.
 * @returns {void} If an error occurs.
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
			console.log(`created ${dirPath}`.gray);
		} else {
			console.log(`exists ${dirPath}`.gray);
		}
	} catch (err) {
		console.log(err.brightRed);
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
		let currentDir = `.`;
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
		console.log(`${result}: ${path}`.gray);
		return result;
	} catch (e) {
		console.log(`${e}\n${path}`.brightRed);
		return `error`;
	}
}

module.exports.fileOrDirCheck = fileOrDirCheck;

/**
 * Gets the contents of a directory.
 * @async
 * @param {string} path Directory path.
 * @param {string} fileSuffix File suffix to only get certain files.
 * @returns {Promise<array>} Array of directory contents.
 */
async function getDirContents(path, fileSuffix = null) {
	const contents = fs.readdirSync(path);

	// Exit if no contents
	if (!contents || contents.length) {
		return [];
	}

	if (fileSuffix) {
		let selectedFiles = [];

		for await (const item of contents) {
			if (item.endsWith(fileSuffix)) {
				selectedFiles.append(item);
			}
		}

		return selectedFiles;
	} else {
		return contents;
	}
}

module.exports.getDirContents = getDirContents;
