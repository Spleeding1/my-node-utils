/**
 * @package my-node-utils
 * my-bools.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.6.0
 *
 * Utility functions that return true or false.
 * const is = require(`./my-bools`);
 *
 * * array(arg)
 * * arrayOfStrings(array)
 * * nullStringOrArray(arg)
 * * objectOrNull(arg)
 * * objectWithProperty(arg, property)
 * * string(arg)
 */

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

function isArrayOfStrings(stringArray) {
	let result = true;
	stringArray.forEach(s => {
		if (!isString(s)) {
			result = false;
		}
	});
	return result;
}

module.exports.arrayOfStrings = isArrayOfStrings;

/**
 * Checks if given argument is null, a string or an array.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is null, a string, or an array.
 */
function isNullStringOrArray(arg) {
	if (arg === null || isString(arg) || isArray(arg)) {
		return true;
	}
	return false;
}

module.exports.nullStringOrArray = isNullStringOrArray;

/**
 * Checks whether the supplied argument is an object or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an object or null.
 */
function isObjectOrNull(arg) {
	if (arg === null || (typeof arg === `object` && !isArray(arg))) {
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
		throw TypeError(`property must be a string`);
	}

	if (typeof arg === `object` && !isArray(arg) && arg !== null && arg.hasOwnProperty(property)) {
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
