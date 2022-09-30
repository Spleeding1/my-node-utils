/**
 * @package my-node-utils
 * my-JSON.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.2.0
 *
 * Utility functions to work with JSON.
 *
 * * keyValueToString(JsonObject, args)
 * * mergeJSON(changeJSON, defaultJSON, defaultKeysOnly = false)
 */

const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Returns formatted key: value string.
 * @param {object} ObjectJSON JSON Object.
 * @param {string} key Desired object key.
 * @param {string} prefix Final string prefix.
 * @param {string} postfix Final sting postfix.
 * @returns {string} Returns formatted string or `` if value is null or undefined.
 */
function keyValueToString(JsonObject, args = null) {
	let delimiter = `: `;
	let keys = null;

	if (!is.object(JsonObject)) {
		throw message.typeError.isNotObject(`JsonObject`);
	}

	if (is.objectOrNull(args)) {
		if (is.objectWithProperty(args, `delimiter`)) {
			if (is.string(args.delimiter)) {
				delimiter = args.delimiter;
			} else {
				throw message.typeError.isNotString(`args.delimiter`);
			}
		}
		if (is.objectWithProperty(args, `keys`)) {
			if (is.arrayOfStringsOrString(args.keys)) {
				if (is.string(args.keys)) {
					keys = [args.keys];
				} else {
					keys = args.keys;
				}
			} else {
				throw message.typeError.isNotArrayOfStringsOrString(`args.keys`);
			}
		}
	} else {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	let returnString = ``;
	if (keys) {
		keys.forEach(key => {
			returnString += `${key}${delimiter}${JsonObject[key]}\n`;
		});
	} else {
		for (key in JsonObject) {
			returnString += `${key}${delimiter}${JsonObject[key]}\n`;
		}
	}

	return returnString;
}

module.exports.keyValueToString = keyValueToString;

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
