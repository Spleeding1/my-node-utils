/**
 * @package my-node-utils
 * my-JSON.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.0.0
 *
 * Utility functions to work with JSON.
 *
 * * mergeJSON(changeJSON, defaultJSON, filePaths = false)
 */

/**
 * Merges JSON files into an object, overwritting duplicate keys.
 * @param {string} changeFile JSON Overwrites.
 * @param {string} defaultFile JSON defaults.
 * @param {bool} filePaths If changeFile and defaultFile are paths.
 * @returns {Promise<object>} Combined object of default and overwritten JSON.
 */
function mergeJSON(changeJSON, defaultJSON, filePaths = false) {
	if (filePaths) {
		changeJSON = require(changeJSON);
		defaultJSON = require(defaultJSON);
	}

	const defaultKeys = Object.keys(defaultJSON);
	let finalJSON = {};

	for await (const key of defaultKeys) {
		finalJSON[key] = key in changeJSON ? changeJSON[key] : defaultJSON[key];
	}

	return finalJSON;
}

module.exports.mergeJSON = mergeJSON;
