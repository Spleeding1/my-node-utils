/**
 * @package my-node-utils
 * my-strings.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.1.0
 *
 * Handles manipulation of strings
 */

const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Format a string to one of the format types.
 * @param {string} inputString String to be formatted.
 * @param {string} format Output format type.
 * @returns {string} Formatted string.
 */
function formatString(inputString, format) {
	if (!is.string(inputString)) {
		throw message.typeError.isNotString(`inputString`);
	}

	if (is.string(format)) {
	} else {
		throw message.typeError.isNotString(`format`);
	}

	let regex = /-|_|,|\s|\./g;

	switch (format) {
		case `camel`:
			const camelI = [];

			while ((myarray = regex.exec(inputString)) !== null) {
				camelI.push(regex.lastIndex);
			}
			if (0 < camelI.length) {
				let formattedString = ``;
				for (let i = 0; i < inputString.length; i++) {
					if (i < 1) {
						formattedString += inputString[i].toLowerCase();
					} else if (camelI.includes(i + 1)) {
						// Remove from string.
					} else if (camelI.includes(i)) {
						formattedString += inputString[i].toUpperCase();
					} else {
						formattedString += inputString[i];
					}
				}
				inputString = formattedString;
			}
			break;
		case `caps`:
			const capsI = [];

			while ((myarray = regex.exec(inputString)) !== null) {
				capsI.push(regex.lastIndex);
			}
			if (0 < capsI.length) {
				let formattedString = ``;
				for (let i = 0; i < inputString.length; i++) {
					if (i < 1) {
						formattedString += inputString[i].toUpperCase();
					} else if (capsI.includes(i + 1)) {
						// Remove from string.
					} else if (capsI.includes(i)) {
						formattedString += inputString[i].toUpperCase();
					} else {
						formattedString += inputString[i];
					}
				}
				inputString = formattedString;
			}
			break;
		case `lower`:
			inputString = inputString.replaceAll(regex, ``).toLowerCase();
			break;
		case `slug`:
			inputString = inputString.replaceAll(regex, `-`).toLowerCase();
			break;
		case `snake`:
			inputString = inputString.replaceAll(regex, `_`).toLowerCase();
			break;
		case `upperSnake`:
			inputString = inputString.replaceAll(regex, `_`).toUpperCase();
			break;
		default:
			inputString = `ERROR${inputString}`;
			break;
	}

	return inputString;
}
module.exports.format = formatString;
