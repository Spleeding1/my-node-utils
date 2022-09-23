/**
 * @package my-node-utils
 * my-JSON.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.1.0
 *
 * Utility functions to work with JSON.
 *
 * * mergeJSON(changeJSON, defaultJSON, defaultKeysOnly = false)
 */

const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Merges JSON object into one object, overwriting duplicate keys.
 * @param {object|string} defaultJSON Default JSON object or path to .json file.
 * @param {object|string} changeJSON JSON object or path to .json file that overwrites defaultJSON.
 * @param {boolean} defaultKeysOnly Restricts output to only keys that are in defaultJSON.
 * @returns {Promise<object>} Merged JSON.
 */
async function mergeJSON(defaultJSON, changeJSON, defaultKeysOnly = false) {
	if (is.object(defaultJSON)) {
	} else if (is.string(defaultJSON)) {
		defaultJSON = await require(defaultJSON);
	} else {
		throw message.typeError.isNotObjectOrString(`defaultJSON`);
	}

	if (is.object(changeJSON)) {
	} else if (is.string(changeJSON)) {
		changeJSON = await require(changeJSON);
	} else {
		throw message.typeError.isNotObjectOrString(`changeJSON`);
	}

	if (!is.boolean(defaultKeysOnly)) {
		throw message.typeError.isNotBoolean(`defaultKeysOnly`);
	}

	const defaultKeys = Object.keys(defaultJSON);
	const changeKeys = Object.keys(changeJSON);
	let finalJSON = {};

	for (const key of defaultKeys) {
		finalJSON[key] = key in changeJSON ? changeJSON[key] : defaultJSON[key];
	}

	if (!defaultKeysOnly) {
		for (const key of changeKeys) {
			if (!(key in defaultJSON)) {
				finalJSON[key] = changeJSON[key];
			}
		}
	}

	return finalJSON;
}

module.exports.merge = mergeJSON;
