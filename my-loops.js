/**
 * @package my-node-utils
 * my-loops.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.0.1
 *
 * Utility functions for loops.
 *
 * * asyncForEach(iterable, asyncFunction)
 */

async function asyncForEach(iterable, asyncFunction) {
	const promises = iterable.map(async i => {
		const result = await asyncFunction(i);

		return result;
	});

	const allPromises = await Promise.all(promises);
}

module.exports.asyncForEach = asyncForEach;
