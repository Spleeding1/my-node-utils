/**
 * @package my-node-utils
 * my-bools.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.1.0
 *
 * Utility functions that return true or false.
 * const is = require(`./my-bools.js`);
 *
 * * objectOrNull(arg)
 */

function objectOrNull(arg) {
	if (arg === null || (typeof arg === `object` && !Array.isArray(arg))) {
		return true;
	}
	return false;
}

module.exports.objectOrNull = objectOrNull;
