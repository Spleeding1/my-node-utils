/**
 * @package my-node-utils
 * my-bools.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.4.0
 *
 * Utility functions that return true or false.
 * const is = require(`./my-bools`);
 *
 * * array(arg)
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
function array(arg) {
	if (Array.isArray(arg)) {
		return true;
	}
	return false;
}

module.exports.array = array;

/**
 * Checks if given argument is null, a string or an array.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is null, a string, or an array.
 */
function nullStringOrArray(arg) {
	if (arg === null || string(arg) || array(arg)) {
		return true;
	}
	return false;
}

module.exports.nullStringOrArray = nullStringOrArray;

/**
 * Checks whether the supplied argument is an object or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an object or null.
 */
function objectOrNull(arg) {
	if (arg === null || (typeof arg === `object` && !array(arg))) {
		return true;
	}
	return false;
}

module.exports.objectOrNull = objectOrNull;

/**
 * Checks whether supplied argument is an object and has given property
 * @param {*} arg Argument to check.
 * @param {string} property Name of property to check for.
 * @returns {boolean} If arg is object and has given property.
 * @throws {TypeError} If property is not a string.
 */
function objectWithProperty(arg, property) {
	if (!string(property)) {
		throw TypeError(`property must be a string`);
	}

	if (typeof arg === `object` && !array(arg) && arg !== null && arg.hasOwnProperty(property)) {
		return true;
	}
	return false;
}

module.exports.objectWithProperty = objectWithProperty;

/**
 * Checks whether given argument is a string.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is a string.
 */
function string(arg) {
	if (typeof arg === `string`) {
		return true;
	}
	return false;
}

module.exports.string = string;
