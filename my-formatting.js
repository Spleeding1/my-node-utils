/**
 * @package my-node-utils
 * my-strings.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version 1.3.0
 *
 * Handles manipulation of strings
 * const format = require(`./format);
 * * format.addLeadingZero(number);
 * * format.date(date, `format`);
 * * format.string(inputString, format);
 */

const is = require(`./my-bools`);
const message = require(`./my-messages`);

/**
 * Conditionally adds a leading '0' to a number if it is between 0-9.
 * @param {int|float} number number to add a leading zero to.
 * @returns {string} number conerted to string with zero applied.
 */
function addLeadingZero(number) {
	if (!is.number(number)) {
		throw message.typeError.isNotNumber(`number`);
	}

	return number < 10 ? `0${number}` : `${number}`;
}
module.exports.addLeadingZero = addLeadingZero;

/**
 * Converts a date to the given format.
 * @param {Date} theDate The date to format.
 * @param {string} format The desired format of the date.
 * @returns {string} The formatted date.
 */
function formatDate(theDate, format) {
	if (!is.date(theDate)) {
		throw message.typeError.isNotDate(`theDate`);
	}

	if (!is.string(format)) {
		throw message.typeError.isNotString(`format`);
	}

	const H = theDate.getHours();
	const HH = addLeadingZero(H);
	const h = H > 12 ? H - 12 : H === 0 ? 12 : H;
	const hh = addLeadingZero(h);

	let t = `a`;
	let tt = `am`;
	let T = `A`;
	let TT = `AM`;

	if (H > 11) {
		t = `p`;
		tt = `pm`;
		T = `P`;
		TT = `PM`;
	}

	const i = theDate.getMinutes();
	const ii = addLeadingZero(i);

	const s = theDate.getSeconds();
	const ss = addLeadingZero(s);

	const yyyy = theDate.getFullYear();
	const yy = yyyy.toString().slice(-2);

	const month = theDate.getMonth();
	const m = month + 1;
	const mm = addLeadingZero(m);
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

	const d = theDate.getDate();
	const dd = addLeadingZero(d);
	const day = theDate.getDay();
	const DDs = [`Mo`, `Tu`, `We`, `Th`, `Fr`, `Sa`, `Su`];
	const DDDs = [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`];
	const DDDDs = [`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`];

	const formatted = format
		.replaceAll(`t`, `k`)
		.replaceAll(`T`, `K`)
		.replaceAll(`d`, `x`)
		.replaceAll(`D`, `X`)
		.replaceAll(`hh`, hh)
		.replaceAll(`h`, h)
		.replaceAll(`HH`, HH)
		.replaceAll(`H`, H)
		.replaceAll(`ii`, ii)
		.replaceAll(`i`, i)
		.replaceAll(`ss`, ss)
		.replaceAll(`s`, s)
		.replaceAll(`yyyy`, yyyy)
		.replaceAll(`yy`, yy)
		.replaceAll(`y`, yy)
		.replaceAll(`mm`, mm)
		.replaceAll(`m`, m)
		.replaceAll(`MMMM`, MMMMs[month])
		.replaceAll(`MMM`, MMMs[month])
		.replaceAll(`MM`, MMs[month])
		.replaceAll(`M`, MMs[month])
		.replaceAll(`kk`, tt)
		.replaceAll(`k`, t)
		.replaceAll(`KK`, TT)
		.replaceAll(`K`, T)
		.replaceAll(`xx`, dd)
		.replaceAll(`x`, d)
		.replaceAll(`XXXX`, DDDDs[day])
		.replaceAll(`XXX`, DDDs[day])
		.replaceAll(`XX`, DDs[day])
		.replaceAll(`X`, DDs[day]);
	return formatted;
}
module.exports.date = formatDate;

function formatList(list, sorting) {}

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
