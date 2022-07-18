/**
 * @package my-node-utils
 * my-messages.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Functions to return commonly used messages
 */

const is = require(`./my-bools`);
const {isNotStringTypeError} = require("./tests/test-data/type-testing");

// ############################################################
// Error Messages
// ############################################################
// ****************************************
// TypeError Messages
// ****************************************

// Used for exporting
let typeErrors = {};

function nullStringOrArrayOfStringsTypeError(arg) {
	if (!is.string(arg)) {
		throw stringTypeError;
	}
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
