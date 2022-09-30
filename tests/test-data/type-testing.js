/**
 * @package my-node-utils
 * type-testing.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Reusable test data for testing correct types with Jest.
 */

// ############################################################
// Building Blocks
// ############################################################
const anArray = {type: `an array`, arg: []};
const anArrayOfStrings = {type: `an array of strings`, arg: [`123`, `123`]};
const anArrayOfNonStrings = {type: `an array of non-strings`, arg: [`123`, 123]};
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
	isNotArray: [isFalse, isNull, aNumber, anObject, aString, isTrue],
	isBoolean: [isTrue, isFalse],
	isNotBoolean: [isNull, aString, aNumber, anObject, anArray],
	isNotNumber: [isTrue, isFalse, aString, anArray, anObject, isNull],
	isNotObject: [isTrue, isFalse, aString, aNumber, anArray, isNull],
	isNotString: [aNumber, anObject, isNull, anArray, isTrue, isFalse],

	// ############################################################
	// Compound Types
	// ############################################################
	isNotArrayOfStrings: [isFalse, isNull, aNumber, anObject, aString, isTrue, anArrayOfNonStrings],
	isArrayOfStringsOrNull: [anArrayOfStrings, isNull],
	isNotArrayOfStringsOrNull: [isFalse, aNumber, anObject, aString, isTrue, anArrayOfNonStrings],
	isArrayOfStringsOrString: [aString, anArrayOfStrings],
	isNotArrayOfStringsOrString: [aNumber, anObject, anArrayOfNonStrings, isTrue, isFalse, isNull],
	isArrayOfStringsStringOrNull: [isNull, aString, anArrayOfStrings],
	isNotArrayOfStringsStringOrNull: [aNumber, anObject, anArrayOfNonStrings, isTrue, isFalse],
	isObjectOrNull: [isNull, anObject],
	isNotObjectOrNull: [aNumber, anArray, isTrue, isFalse, aString],
	isObjectOrString: [anObject, aString],
	isNotObjectOrString: [isNull, aNumber, isTrue, isFalse, anArray],
	isStringOrNull: [aString, isNull],
	isNotStringOrNull: [anArray, isFalse, anObject, isTrue, aNumber],
};
module.exports.type = dataTypes;
