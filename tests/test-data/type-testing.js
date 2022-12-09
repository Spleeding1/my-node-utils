/**
 * @package my-node-utils
 * type-testing.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Reusable test data for testing correct types with Jest.
 */

// TODO: create .gitinclude.
// TODO: check for uniform formatting when completed.

// ############################################################
// Building Blocks
// ############################################################
const anArray = {type: `an array`, arg: []};
const anArrayOfStrings = {type: `an array of strings`, arg: [`123`, `123`]};
const anArrayOfNonStrings = {type: `an array of non-strings`, arg: [`123`, 123]};
const aDate = {type: `a date`, arg: new Date()};
const isFalse = {type: `false`, arg: false};
const isNull = {type: `null`, arg: null};
const aNumber = {type: `a number`, arg: 123};
const anObject = {type: `an object`, arg: {}};
const aString = {type: `a string`, arg: `123`};
const isTrue = {type: `true`, arg: true};

// Holds all "type" exports.
let dataTypes = {
	// ############################################################
	// Singular Types
	// ############################################################
	isNotArray: [isFalse, isNull, aNumber, anObject, aString, isTrue, aDate],
	isBoolean: [isTrue, isFalse],
	isNotBoolean: [isNull, aString, aNumber, anObject, anArray, aDate],
	isNotDate: [anArray, isFalse, isNull, aNumber, anObject, aString, isTrue],
	isNotNumber: [isTrue, isFalse, aString, anArray, anObject, isNull, aDate],
	isNotObject: [isTrue, isFalse, aString, aNumber, anArray, isNull, aDate],
	isNotString: [aNumber, anObject, isNull, anArray, isTrue, isFalse, aDate],

	// ############################################################
	// Compound Types
	// ############################################################
	isNotArrayOfStrings: [
		isFalse,
		isNull,
		aNumber,
		anObject,
		aString,
		isTrue,
		anArrayOfNonStrings,
		aDate,
	],
	isArrayOfStringsOrNull: [anArrayOfStrings, isNull],
	isNotArrayOfStringsOrNull: [
		isFalse,
		aNumber,
		anObject,
		aString,
		isTrue,
		anArrayOfNonStrings,
		aDate,
	],
	isArrayOfStringsOrString: [aString, anArrayOfStrings],
	isNotArrayOfStringsOrString: [
		aNumber,
		anObject,
		anArrayOfNonStrings,
		isTrue,
		isFalse,
		isNull,
		aDate,
	],
	isArrayOfStringsStringOrNull: [isNull, aString, anArrayOfStrings],
	isNotArrayOfStringsStringOrNull: [aNumber, anObject, anArrayOfNonStrings, isTrue, isFalse, aDate],
	isObjectOrNull: [isNull, anObject],
	isNotObjectOrNull: [aNumber, anArray, isTrue, isFalse, aString, aDate],
	isObjectOrString: [anObject, aString],
	isNotObjectOrString: [isNull, aNumber, isTrue, isFalse, anArray, aDate],
	isStringOrNull: [aString, isNull],
	isNotStringOrNull: [anArray, isFalse, anObject, isTrue, aNumber, aDate],
};
module.exports.type = dataTypes;
