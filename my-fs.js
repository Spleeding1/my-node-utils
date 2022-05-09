/**
 * @package node_packages
 * my-fs.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.0.0
 *
 * Utility functions that use fs.
 */

const colors = require(`colors`);
const fs = require(`fs`);

/**
 * Creates the directory if it doesn't already exist.
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
 * @param {string} path Path of file or directory.
 * @returns {string} The result of the check.
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
