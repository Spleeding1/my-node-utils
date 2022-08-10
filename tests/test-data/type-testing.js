/**
 * @package my-node-utils
 * type-testing.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Reusable test data for testing correct types with Jest.
 */

const isBoolean = [
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];

module.exports.isBoolean = isBoolean;

const isNotBooleanTypeError = [
	{type: `null`, arg: null},
	{type: `string`, arg: `123`},
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `an array`, arg: []},
];

module.exports.isNotBooleanTypeError = isNotBooleanTypeError;

const isNullStringOrArrayOfStrings = [
	{type: `null`, arg: null},
	{type: `string`, arg: `123`},
	{type: `an array of strings`, arg: [`123`, `456`]},
];

module.exports.isNullStringOrArrayOfStrings = isNullStringOrArrayOfStrings;

const isNotNullStringOrArrayOfStringsTypeError = [
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `an array of non-strings`, arg: [`123`, 123]},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];

module.exports.isNotNullStringOrArrayOfStringsTypeError = isNotNullStringOrArrayOfStringsTypeError;

const isNotStringTypeError = [
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `null`, arg: null},
	{type: `an array`, arg: []},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];

module.exports.isNotStringTypeError = isNotStringTypeError;
