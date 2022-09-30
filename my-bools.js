/**
 * @package my-node-utils
 * my-bools.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.10.2
 *
 * Utility functions that return true or false.
 * const is = require(`./my-bools`);
 *
 * * array(arg)
 * * arrayOfStrings(array)
 * * arrayOfStringsOrNull(arg)
 * * boolean(arg)
 * * number(arg)
 * * object(arg)
 * * objectOrNull(arg)
 * * objectWithProperty(arg, property)
 * * string(arg)
 * * stringOrNull(arg)
 */

const message = require(`./my-messages`);

/**
 * Checks whether given argument is an array.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an array.
 */
function isArray(arg) {
	if (Array.isArray(arg)) {
		return true;
	}
	return false;
}
module.exports.array = isArray;

/**
 * Checks if given argument is an array of strings.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an array of strings.
 */
function isArrayOfStrings(arg) {
	let result = true;
	if (isArray(arg)) {
		arg.forEach(s => {
			if (!isString(s)) {
				result = false;
			}
		});
	} else {
		result = false;
	}
	return result;
}
module.exports.arrayOfStrings = isArrayOfStrings;

/**
 * Checks if given argument is null, a string or an array.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is null, a string, or an array.
 */
function isArrayOfStringsOrNull(arg) {
	let result = true;
	if (isArray(arg)) {
		arg.forEach(s => {
			if (!isString(s)) {
				result = false;
			}
		});
	} else if (arg === null) {
		result = true;
	} else {
		result = false;
	}
	return result;
}
module.exports.arrayOfStringsOrNull = isArrayOfStringsOrNull;

/**
 * Checks if given argument is an array of strings, a string or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an array of strings, a string or null.
 */
function isArrayOfStringsStringOrNull(arg) {
	let result = true;
	if (isArray(arg)) {
		arg.forEach(s => {
			if (!isString(s)) {
				result = false;
			}
		});
	} else if (arg === null || isString(arg)) {
		result = true;
	} else {
		result = false;
	}
	return result;
}
module.exports.arrayOfStringsStringOrNull = isArrayOfStringsStringOrNull;

/**
 * Checks if given argument is boolean.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is boolean.
 */
function isBoolean(arg) {
	if (arg === true || arg === false) {
		return true;
	}
	return false;
}
module.exports.boolean = isBoolean;

/**
 * Checks if given argument is a number.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is boolean.
 */
function isNumber(arg) {
	if (typeof arg === `number`) {
		return true;
	}
	return false;
}
module.exports.number = isNumber;

/**
 * Checks whether the supplied argument is an object or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an object or null.
 */
function isObject(arg) {
	if (typeof arg === `object` && !isArray(arg) && arg !== null) {
		return true;
	}
	return false;
}
module.exports.object = isObject;

/**
 * Checks whether the supplied argument is an object or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an object or null.
 */
function isObjectOrNull(arg) {
	if (arg === null || isObject(arg)) {
		return true;
	}
	return false;
}
module.exports.objectOrNull = isObjectOrNull;

/**
 * Checks whether supplied argument is an object and has given property
 * @param {*} arg Argument to check.
 * @param {string} property Name of property to check for.
 * @returns {boolean} If arg is object and has given property.
 * @throws {TypeError} If property is not a string.
 */
function isObjectWithProperty(arg, property) {
	if (!isString(property)) {
		throw message.typeError.isNotString(`property`);
	}

	if (isObject(arg) && arg.hasOwnProperty(property)) {
		return true;
	}
	return false;
}
module.exports.objectWithProperty = isObjectWithProperty;

/**
 * Checks whether given argument is a string.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is a string.
 */
function isString(arg) {
	if (typeof arg === `string`) {
		return true;
	}
	return false;
}
module.exports.string = isString;

/**
 * Checks whether given argument is a string or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is a string or null.
 */
function isStringOrNull(arg) {
	if (typeof arg === `string` || arg === null) {
		return true;
	}
	return false;
}
module.exports.stringOrNull = isStringOrNull;
