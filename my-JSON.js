/**
 * @package my-node-utils
 * my-JSON.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.2.1
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
 * @param {array|string} args.keys Desired object key.
 * @param {string} args.betweenEach Placed in between each key: value pair.
 * @param {string} args.delimiter Placed in between key and value.
 * @param {string} args.prefix Final string prefix.
 * @param {string} args.suffix Final sting suffix.
 * @param {boolean} args.changeEmpty Will change empty values to empty string.
 * @param {boolean} args.ignoreEmpty Will skip empty values.
 * @returns {string} Returns formatted string.
 */
function keyValueToString(JsonObject, args = null) {
	let keys = null;
	let prefix = ``;
	let delimiter = `: `;
	let betweenEach = `\n`;
	let suffix = ``;
	let changeEmpty = false;
	let ignoreEmpty = false;

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
		if (is.objectWithProperty(args, `prefix`)) {
			if (is.string(args.prefix)) {
				prefix = args.prefix;
			} else {
				throw message.typeError.isNotString(`args.prefix`);
			}
		}
		if (is.objectWithProperty(args, `suffix`)) {
			if (is.string(args.suffix)) {
				suffix = args.suffix;
			} else {
				throw message.typeError.isNotString(`args.suffix`);
			}
		}
		if (is.objectWithProperty(args, `betweenEach`)) {
			if (is.string(args.betweenEach)) {
				betweenEach = args.betweenEach;
			} else {
				throw message.typeError.isNotString(`args.betweenEach`);
			}
		}
		if (is.objectWithProperty(args, `changeEmpty`)) {
			if (is.boolean(args.changeEmpty)) {
				changeEmpty = args.changeEmpty;
			} else {
				throw message.typeError.isNotBoolean(`args.changeEmpty`);
			}
		}
		if (is.objectWithProperty(args, `ignoreEmpty`)) {
			if (is.boolean(args.ignoreEmpty)) {
				ignoreEmpty = args.ignoreEmpty;
			} else {
				throw message.typeError.isNotBoolean(`args.ignoreEmpty`);
			}
		}
	} else {
		throw message.typeError.isNotObjectOrNull(`args`);
	}

	function writeKeyValue(key, returnString) {
		const value =
			(changeEmpty || ignoreEmpty) &&
			(JsonObject[key] === null || JsonObject[key] === false || JsonObject[key] === undefined)
				? ``
				: JsonObject[key];
		if (!(ignoreEmpty && value === ``)) {
			returnString += returnString === prefix ? `` : betweenEach;
			returnString += `${key}${delimiter}${value}`;
		}
		return returnString;
	}

	let returnString = prefix;
	if (keys) {
		keys.forEach(key => {
			returnString = writeKeyValue(key, returnString);
		});
	} else {
		for (key in JsonObject) {
			returnString = writeKeyValue(key, returnString);
		}
	}
	returnString += suffix;

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
