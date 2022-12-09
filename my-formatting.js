/**
 * @package my-node-utils
 * my-strings.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.2.0
 *
 * Handles manipulation of strings
 * const format = require(`./format);
 * * format.string(inputString, format);
 */

const is = require(`./my-bools`);
const message = require(`./my-messages`);

function formatDate(theDate, format) {
	if (!is.date(theDate)) {
		throw message.typeError.isNotDate(`theDate`);
	}

	if (!is.string(format)) {
		throw message.typeError.isNotString(`format`);
	}

	const d = theDate.getDate();
	const dd = d < 10 ? `0${d}` : d;
	const day = theDate.getDay();
	const DDs = [`Mo`, `Tu`, `We`, `Th`, `Fr`, `Sa`, `Su`];
	const DDDs = [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`];
	const DDDDs = [`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`];
	const month = theDate.getMonth();
	const m = month + 1;
	const mm = d < 10 ? `0${m}` : m;
	const MMs = [`Ja`, `Fe`, `Ma`, `Ap`, `Ma`, `Jn`, `Jl`, `Au`, `Se`, `Oc`, `No`, `De`];
	const MMMs = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
	const MMMMs = [
		`January`,
		`February`,
		`March`,
		`April`,
		`May`,
		`June`,
		`July`,
		`August`,
		`September`,
		`October`,
		`November`,
		`December`,
	];

	const formatted = format
		.replaceAll(`dd`, dd)
		.replaceAll(`d`, d)
		.replaceAll(`DDDD`, DDDDs[day])
		.replaceAll(`DDD`, DDDs[day])
		.replaceAll(`DD`, DDs[day])
		.replaceAll(`D`, DDs[day])
		.replaceAll(`mm`, mm)
		.replaceAll(`m`, m)
		.replaceAll(`MMMM`, MMMMs[month])
		.replaceAll(`MMM`, MMMs[month])
		.replaceAll(`MM`, MMs[month])
		.replaceAll(`M`, MMs[month]);
	return formatted;
}
module.exports.date = formatDate;

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
module.exports.string = formatString;
