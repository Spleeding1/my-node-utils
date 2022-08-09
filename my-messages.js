/**
 * @package my-node-utils
 * my-messages.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * version 1.3.0
 *
 * Functions to return commonly used messages
 * * booleanTypeError
 * * nullStringOrArrayOfStringsTypeError
 * * stringTypeError
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

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not boolean.
 */
function booleanTypeError(arg) {
	if (!is.string(arg)) {
		throw stringTypeError(arg);
	}
	return TypeError(`$${arg} must be true or false!`);
}
typeErrors.boolean = booleanTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg Argument name that should be a string.
 * @returns {TypeError}
 * @throws {TypeError} If $arg is not a string.
 */
function nullStringOrArrayOfStringsTypeError(arg) {
	if (!is.string(arg)) {
		throw stringTypeError(arg);
	}
	return TypeError(`$${arg} must be a string, string[], or null!`);
}
typeErrors.nullStringOrArrayOfStrings = nullStringOrArrayOfStringsTypeError;

/**
 * Returns TypeError with uniform message.
 * @param {string} arg name of arg that should be a string.
 * @returns TypeError
 * @throws TypeError if $arg is not a string.
 */
function stringTypeError(arg) {
	if (!is.string(arg)) {
		throw TypeError(`$arg must be a string!`);
	}

	return TypeError(`$${arg} must be a string!`);
}
typeErrors.string = stringTypeError;

module.exports.typeError = typeErrors;
