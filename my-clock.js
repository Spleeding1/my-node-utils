/**
 * @package my-node-utils
 * my-clock.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.2.2
 *
 * Utility clock and timing functions.
 *
 * * startTimer()
 * * stopTimer(startTime)
 */

/**
 * Starting time for clocking process performance.
 * @returns {number}
 */
function startTimer() {
	return performance.now();
}

/**
 * Calculates elapsed time for process performance clocking.
 * @param {object} startTime Starting time for process performance.
 * @returns {string} Difference between startTime and stopTime in seconds.
 */
function stopTimer(startTime) {
	if (typeof startTime !== `number`) {
		throw TypeError(`startTime must be a number`);
	}
	const elapsedTime = performance.now() - startTime;
	return `${(elapsedTime / 1000).toFixed(3)}s`;
}

module.exports.timer = {
	start: startTimer,
	stop: stopTimer,
};
