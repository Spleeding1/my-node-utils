/**
 * @package my-node-utils
 * my-messages.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * version 1.10.0
 *
 * Functions to return commonly used messages
 * * isNotBooleanTypeError(arg)
 * * isNoDateTypeError(arg)
 * * isNotNumberTypeError(arg)
 * * isNotObjectTypeError(arg)
 * * isNotStringTypeError(arg)
 * * isNotArrayOfStringsOrStringTypeError(arg)
 * * isNotArrayOfStringsStringOrNullTypeError(arg)
 * * isNotObjectOrNullTypeError(arg)
 * * isNotObjectOrStringTypeError(arg)
 * * isNotStringOrNullTypeError(arg)
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
 * @param {string} arg Argument name that should be boolean.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
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
 * @param {string} arg Argument name that should be a date.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */

function isNotDateTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be a date!`);
}
typeErrors.isNotDate = isNotDateTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a number.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */

function isNotNumberTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be a number!`);
}
typeErrors.isNotNumber = isNotNumberTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be an object.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function isNotObjectTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be an object!`);
}
typeErrors.isNotObject = isNotObjectTypeError;

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
 * @param {string} arg Argument name that should be string[] or string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function isNotArrayOfStringsOrStringTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be a string[] or string!`);
}
typeErrors.isNotArrayOfStringsOrString = isNotArrayOfStringsOrStringTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be string[], string, or null.
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
 * @param {string} arg Argument name that should be an object or null.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function isNotObjectOrNullTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be an object or null!`);
}
typeErrors.isNotObjectOrNull = isNotObjectOrNullTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be an object or a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function isNotObjectOrStringTypeError(arg) {
	if (!is.string(arg)) {
		throw isNotStringTypeError(arg);
	}
	return TypeError(`$${arg} must be an object or a string!`);
}
typeErrors.isNotObjectOrString = isNotObjectOrStringTypeError;

module.exports.typeError = typeErrors;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg name of arg that should be a string or null.
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
