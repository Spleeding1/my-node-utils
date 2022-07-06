/**
 * @package my-node-utils
 * my-bools.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.2.0
 *
 * Utility functions that return true or false.
 * const is = require(`./my-bools`);
 *
 * * objectOrNull(arg)
 * * objectWithProperty(arg, property)
 */

/**
 * Checks whether the supplied argument is an object or null.
 * @param {*} arg Argument to check.
 * @returns {boolean} If arg is an object or null.
 */
function objectOrNull(arg) {
	if (arg === null || (typeof arg === `object` && !Array.isArray(arg))) {
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
	if (typeof property !== `string`) {
		throw TypeError(`property must be a string`);
	}

	if (
		typeof arg === `object` &&
		!Array.isArray(arg) &&
		arg !== null &&
		arg.hasOwnProperty(property)
	) {
		return true;
	}
	return false;
}

module.exports.objectWithProperty = objectWithProperty;
