/**
 * @package my-node-utils
 * type-testing.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Reusable test data for testing correct types with Jest.
 */

// Holds all "type" exports.
let dataTypes = {};

// ############################################################
// Singular Types
// ############################################################
const isBooleanType = [
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];
dataTypes[`isBoolean`] = isBooleanType;

const isNotBooleanType = [
	{type: `null`, arg: null},
	{type: `a string`, arg: `123`},
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `an array`, arg: []},
];
dataTypes[`isNotBoolean`] = isNotBooleanType;

const isNotStringType = [
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `null`, arg: null},
	{type: `an array`, arg: []},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];
dataTypes[`isNotString`] = isNotStringType;

// ############################################################
// Compound Types
// ############################################################
const isArrayOfStringsStringOrNullType = [
	{type: `null`, arg: null},
	{type: `a string`, arg: `123`},
	{type: `an array of strings`, arg: [`123`, `456`]},
];
dataTypes[`isArrayOfStringsStringOrNull`] = isArrayOfStringsStringOrNullType;

const isNotArrayOfStringsStringOrNullType = [
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `an array of non-strings`, arg: [`123`, 123]},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];
dataTypes[`isNotArrayOfStringsStringOrNull`] = isNotArrayOfStringsStringOrNullType;

const isObjectOrNullType = [
	{type: `an object`, arg: {}},
	{type: `null`, arg: null},
];
dataTypes[`isObjectOrNull`] = isObjectOrNullType;

const isNotObjectOrNullType = [
	{type: `a number`, arg: 123},
	{type: `an array`, arg: []},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
	{type: `a string`, arg: `123`},
];
dataTypes[`isNotObjectOrNull`] = isNotObjectOrNullType;

module.exports.type = dataTypes;
