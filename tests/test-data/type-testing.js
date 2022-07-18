/**
 * @package my-node-utils
 * type-testing.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Reusable test data for testing correct types with Jest.
 */

const isNotStringTypeError = [
	{type: `a number`, arg: 123},
	{type: `an object`, arg: {}},
	{type: `null`, arg: null},
	{type: `an array`, arg: []},
	{type: `true`, arg: true},
	{type: `false`, arg: false},
];

module.exports.isNotStringTypeError = isNotStringTypeError;
