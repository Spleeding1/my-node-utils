/**
 * @package my-node-utils
 * my-clock.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.0.0
 *
 * Utility clock and timing functions.
 *
 * * startClock()
 * * stopClock(startTime)
 */

/**
 * Starting time for clocking process performance.
 * @returns performance.now().
 */
function startClock() {
	return performance.now();
}

module.exports.startClock = startClock;

/**
 * Calculates elapsed time for process performance clocking.
 * @param {object} startTime Starting time for process performance.
 * @returns {string} Difference between startTime and stopTime in seconds.
 */
function stopClock(startTime) {
	const elaspedTime = performance.now() - startTime;
	return `${(elaspedTime / 1000).toFixed(3)}s`;
}

module.exports.stopClock = stopClock;
