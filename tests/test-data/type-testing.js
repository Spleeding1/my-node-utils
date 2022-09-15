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
const anArrayOfStrings = {type: `an array of non-strings`, arg: [`123`, 123]};
const isFalse = {type: `false`, arg: false};
const isNull = {type: `null`, arg: null};
const aNumber = {type: `a number`, arg: 123};
const anObject = {type: `an object`, arg: {}};
const aString = {type: `a string`, arg: `123`};
const isTrue = {type: `true`, arg: true};

// Holds all "type" exports.
let dataTypes = {};

// ############################################################
// Singular Types
// ############################################################
const isBooleanType = [isTrue, isFalse];
dataTypes[`isBoolean`] = isBooleanType;

const isNotBooleanType = [isNull, aString, aNumber, anObject, anArray];
dataTypes[`isNotBoolean`] = isNotBooleanType;

const isNotStringType = [aNumber, anObject, isNull, anArray, isTrue, isFalse];
dataTypes[`isNotString`] = isNotStringType;

// ############################################################
// Compound Types
// ############################################################
const isArrayOfStringsStringOrNullType = [isNull, aString, anArrayOfStrings];
dataTypes[`isArrayOfStringsStringOrNull`] = isArrayOfStringsStringOrNullType;

const isNotArrayOfStringsStringOrNullType = [aNumber, anObject, anArrayOfStrings, isTrue, isFalse];
dataTypes[`isNotArrayOfStringsStringOrNull`] = isNotArrayOfStringsStringOrNullType;

const isObjectOrNullType = [isNull, anObject];
dataTypes[`isObjectOrNull`] = isObjectOrNullType;

const isNotObjectOrNullType = [aNumber, anArray, isTrue, isFalse, aString];
dataTypes[`isNotObjectOrNull`] = isNotObjectOrNullType;

const isStringOrNullType = [aString, isNull];
dataTypes[`isStringOrNull`] = isStringOrNullType;

const isNotStringOrNullType = [anArray, isFalse, anObject, isTrue, aNumber];
dataTypes[`isNotStringOrNull`] = isNotStringOrNullType;

module.exports.type = dataTypes;
