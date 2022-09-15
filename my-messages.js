/**
 * @package my-node-utils
 * my-messages.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * version 1.4.0
 *
 * Functions to return commonly used messages
 * * isNotBooleanTypeError(arg)
 * * isNotStringTypeError(arg)
 * * isNotArrayOfStringsStringOrNullTypeError(arg)
 * * isNotObjectOrNullTypeError(arg)
 */

const is = require(`./my-bools`);

// ############################################################
// Error Messages
// ############################################################
// ****************************************
// TypeError Messages
// ****************************************

// Used for exporting
let typeErrors = {};

// ------------------------------
// Singular Types
// ------------------------------
/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not boolean.
 */

function isNotBooleanTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be true or false!`);
}
typeErrors.isNotBoolean = isNotBooleanTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg name of arg that should be a string.
 * @returns TypeError
 * @throws TypeError if $arg is not a string.
 */
function isNotStringTypeError(arg) {
	if (!is.string(arg)) {
		throw TypeError(`$arg must be a string!`);
	}

	return TypeError(`$${arg} must be a string!`);
}
typeErrors.isNotString = isNotStringTypeError;

// ------------------------------
// Compound Types
// ------------------------------
/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function isNotArrayOfStringsStringOrNullTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be a string[], string, or null!`);
}
typeErrors.isNotArrayOfStringsStringOrNull = isNotArrayOfStringsStringOrNullTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not an object or null.
 */
function isNotObjectOrNullTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be an object or null!`);
}
typeErrors.isNotObjectOrNull = isNotObjectOrNullTypeError;

module.exports.typeError = typeErrors;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg name of arg that should be a string.
 * @returns TypeError
 * @throws TypeError if $arg is not a string.
 */
function isNotStringOrNullTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(`arg`);
	}

	return TypeError(`$${arg} must be a string or null!`);
}
typeErrors.isNotStringOrNull = isNotStringOrNullTypeError;
