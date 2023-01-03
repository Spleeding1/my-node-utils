/**
 * @package my-node-utils
 * my-strings.test.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Test file for my-strings.js
 */

const format = require(`../my-formatting`);
const is = require(`../my-bools`);
const testData = require(`./test-data/type-testing`);

describe(`addLeadingZero`, () => {
	// ------------------------------
	// Argument type checks
	// ------------------------------
	test(`should not throw error if number is a number`, () => {
		expect(() => {
			format.addLeadingZero(5);
		}).not.toThrow();
	});

	test.each(testData.type.isNotNumber)(`should throw error if number is $type`, ({type, arg}) => {
		expect(() => {
			format.addLeadingZero(arg);
		}).toThrow(TypeError(`$number must be a number!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each([
		{arg: 5, expected: `05`},
		{arg: 15, expected: `15`},
		{arg: 0, expected: `00`},
		{arg: 12, expected: `12`},
	])(`should return $expected if number is $arg`, ({arg, expected}) => {
		const result = format.addLeadingZero(arg);
		expect(is.string(result)).toBeTruthy();
		expect(result).toStrictEqual(expected);
	});
});

describe(`formatDate`, () => {
	const date1 = new Date(`2021-01-11T04:11:09.269Z`);
	const date2 = new Date(`2022-11-05T15:09:00.269Z`);
	const date3 = new Date(`2023-11-01T17:00:11.269Z`);

	// ------------------------------
	// Argument type checks
	// ------------------------------
	test(`should not throw error if theDate is a date`, () => {
		const theDate = new Date();
		expect(() => {
			format.date(theDate, `format`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotDate)(`should throw error if theDate is $type`, ({type, arg}) => {
		expect(() => {
			format.date(arg, `format`);
		}).toThrow(TypeError(`$theDate must be a date!`));
	});

	test(`should not throw error if format is a string`, () => {
		expect(() => {
			format.date(date1, `format`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should not throw error if format is $type`,
		({type, arg}) => {
			expect(() => {
				format.date(date1, arg);
			}).toThrow(TypeError(`$format must be a string!`));
		}
	);

	// ------------------------------
	// Functionality
	// ------------------------------
	// ######## Days ########
	// ***** Digit Days *****
	test(`should return a day digit for 'd'`, () => {
		const result1 = format.date(date1, `d`);
		expect(result1).toStrictEqual(`10`);

		const result2 = format.date(date2, `d`);
		expect(result2).toStrictEqual(`5`);

		const result3 = format.date(date3, `d`);
		expect(result3).toStrictEqual(`1`);
	});

	test(`should return a day digit for 'dd'`, () => {
		const result1 = format.date(date1, `dd`);
		expect(result1).toStrictEqual(`10`);

		const result2 = format.date(date2, `dd`);
		expect(result2).toStrictEqual(`05`);

		const result3 = format.date(date3, `dd`);
		expect(result3).toStrictEqual(`01`);
	});

	// ***** Name Days *****
	test(`should return day short abbreviation  for 'D'`, () => {
		const result1 = format.date(date1, `D`);
		expect(result1).toStrictEqual(`Mo`);

		const result2 = format.date(date2, `D`);
		expect(result2).toStrictEqual(`Su`);

		const result3 = format.date(date3, `D`);
		expect(result3).toStrictEqual(`Th`);
	});

	test(`should return day short abbreviation  for 'DD'`, () => {
		const result1 = format.date(date1, `DD`);
		expect(result1).toStrictEqual(`Mo`);

		const result2 = format.date(date2, `DD`);
		expect(result2).toStrictEqual(`Su`);

		const result3 = format.date(date3, `DD`);
		expect(result3).toStrictEqual(`Th`);
	});

	test(`should return day long abbreviation  for 'DDD'`, () => {
		const result1 = format.date(date1, `DDD`);
		expect(result1).toStrictEqual(`Mon`);

		const result2 = format.date(date2, `DDD`);
		expect(result2).toStrictEqual(`Sun`);

		const result3 = format.date(date3, `DDD`);
		expect(result3).toStrictEqual(`Thu`);
	});

	test(`should return day name for 'DDDD'`, () => {
		const result1 = format.date(date1, `DDDD`);
		expect(result1).toStrictEqual(`Monday`);

		const result2 = format.date(date2, `DDDD`);
		expect(result2).toStrictEqual(`Sunday`);

		const result3 = format.date(date3, `DDDD`);
		expect(result3).toStrictEqual(`Thursday`);
	});

	// ######## Months ########
	// ***** Digit months *****
	test(`should return digit month for 'm'`, () => {
		const result1 = format.date(date1, `m`);
		expect(result1).toStrictEqual(`1`);

		const result2 = format.date(date2, `m`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `m`);
		expect(result3).toStrictEqual(`11`);
	});

	test(`should return digit month for 'mm'`, () => {
		const result1 = format.date(date1, `mm`);
		expect(result1).toStrictEqual(`01`);

		const result2 = format.date(date2, `mm`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `mm`);
		expect(result3).toStrictEqual(`11`);
	});

	// ***** Name Months *****
	test(`should return month name for 'M'`, () => {
		const result1 = format.date(date1, `M`);
		expect(result1).toStrictEqual(`Ja`);

		const result2 = format.date(date2, `M`);
		expect(result2).toStrictEqual(`No`);

		const result3 = format.date(date3, `M`);
		expect(result3).toStrictEqual(`No`);
	});

	test(`should return month name for 'MM'`, () => {
		const result1 = format.date(date1, `MM`);
		expect(result1).toStrictEqual(`Ja`);

		const result2 = format.date(date2, `MM`);
		expect(result2).toStrictEqual(`No`);

		const result3 = format.date(date3, `MM`);
		expect(result3).toStrictEqual(`No`);
	});

	test(`should return month name for 'MMM'`, () => {
		const result1 = format.date(date1, `MMM`);
		expect(result1).toStrictEqual(`Jan`);

		const result2 = format.date(date2, `MMM`);
		expect(result2).toStrictEqual(`Nov`);

		const result3 = format.date(date3, `MMM`);
		expect(result3).toStrictEqual(`Nov`);
	});

	test(`should return month name for 'MMMM'`, () => {
		const result1 = format.date(date1, `MMMM`);
		expect(result1).toStrictEqual(`January`);

		const result2 = format.date(date2, `MMMM`);
		expect(result2).toStrictEqual(`November`);

		const result3 = format.date(date3, `MMMM`);
		expect(result3).toStrictEqual(`November`);
	});

	// ######## Years ########
	test(`should return digit year for 'y'`, () => {
		const result1 = format.date(date1, `y`);
		expect(result1).toStrictEqual(`21`);

		const result2 = format.date(date2, `y`);
		expect(result2).toStrictEqual(`22`);

		const result3 = format.date(date3, `y`);
		expect(result3).toStrictEqual(`23`);
	});

	test(`should return digit year for 'yy'`, () => {
		const result1 = format.date(date1, `yy`);
		expect(result1).toStrictEqual(`21`);

		const result2 = format.date(date2, `yy`);
		expect(result2).toStrictEqual(`22`);

		const result3 = format.date(date3, `yy`);
		expect(result3).toStrictEqual(`23`);
	});

	test(`should return digit year for 'yyyy'`, () => {
		const result1 = format.date(date1, `yyyy`);
		expect(result1).toStrictEqual(`2021`);

		const result2 = format.date(date2, `yyyy`);
		expect(result2).toStrictEqual(`2022`);

		const result3 = format.date(date3, `yyyy`);
		expect(result3).toStrictEqual(`2023`);
	});

	// ######## Hours ########
	test(`should return hour for 'h'`, () => {
		const result1 = format.date(date1, `h`);
		expect(result1).toStrictEqual(`11`);

		const result2 = format.date(date2, `h`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `h`);
		expect(result3).toStrictEqual(`1`);
	});

	test(`should return hour for 'hh'`, () => {
		const result1 = format.date(date1, `hh`);
		expect(result1).toStrictEqual(`11`);

		const result2 = format.date(date2, `hh`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `hh`);
		expect(result3).toStrictEqual(`01`);
	});

	test(`should return hour for 'H'`, () => {
		const result1 = format.date(date1, `H`);
		expect(result1).toStrictEqual(`23`);

		const result2 = format.date(date2, `H`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `H`);
		expect(result3).toStrictEqual(`13`);
	});

	test(`should return hour for 'HH'`, () => {
		const result1 = format.date(date1, `HH`);
		expect(result1).toStrictEqual(`23`);

		const result2 = format.date(date2, `HH`);
		expect(result2).toStrictEqual(`11`);

		const result3 = format.date(date3, `HH`);
		expect(result3).toStrictEqual(`13`);
	});

	// ######## Minutes ########
	test(`should return minutes for 'i'`, () => {
		const result1 = format.date(date1, `i`);
		expect(result1).toStrictEqual(`11`);

		const result2 = format.date(date2, `i`);
		expect(result2).toStrictEqual(`9`);

		const result3 = format.date(date3, `i`);
		expect(result3).toStrictEqual(`0`);
	});

	test(`should return minutes for 'ii'`, () => {
		const result1 = format.date(date1, `ii`);
		expect(result1).toStrictEqual(`11`);

		const result2 = format.date(date2, `ii`);
		expect(result2).toStrictEqual(`09`);

		const result3 = format.date(date3, `ii`);
		expect(result3).toStrictEqual(`00`);
	});

	// ######## Seconds ########
	test(`should return seconds for 's'`, () => {
		const result1 = format.date(date1, `s`);
		expect(result1).toStrictEqual(`9`);

		const result2 = format.date(date2, `s`);
		expect(result2).toStrictEqual(`0`);

		const result3 = format.date(date3, `s`);
		expect(result3).toStrictEqual(`11`);
	});

	test(`should return seconds for 'ss'`, () => {
		const result1 = format.date(date1, `ss`);
		expect(result1).toStrictEqual(`09`);

		const result2 = format.date(date2, `ss`);
		expect(result2).toStrictEqual(`00`);

		const result3 = format.date(date3, `ss`);
		expect(result3).toStrictEqual(`11`);
	});

	// ######## Descriptor (am/pm) ########
	test(`should return designator for 't'`, () => {
		const result1 = format.date(date1, `t`);
		expect(result1).toStrictEqual(`p`);

		const result2 = format.date(date2, `t`);
		expect(result2).toStrictEqual(`a`);

		const result3 = format.date(date3, `t`);
		expect(result3).toStrictEqual(`p`);
	});

	test(`should return designator for 'tt'`, () => {
		const result1 = format.date(date1, `tt`);
		expect(result1).toStrictEqual(`pm`);

		const result2 = format.date(date2, `tt`);
		expect(result2).toStrictEqual(`am`);

		const result3 = format.date(date3, `tt`);
		expect(result3).toStrictEqual(`pm`);
	});

	test(`should return designator for 'T'`, () => {
		const result1 = format.date(date1, `T`);
		expect(result1).toStrictEqual(`P`);

		const result2 = format.date(date2, `T`);
		expect(result2).toStrictEqual(`A`);

		const result3 = format.date(date3, `T`);
		expect(result3).toStrictEqual(`P`);
	});

	test(`should return designator for 'TT'`, () => {
		const result1 = format.date(date1, `TT`);
		expect(result1).toStrictEqual(`PM`);

		const result2 = format.date(date2, `TT`);
		expect(result2).toStrictEqual(`AM`);

		const result3 = format.date(date3, `TT`);
		expect(result3).toStrictEqual(`PM`);
	});

	// ######## Combos ########
	test(`should return formatted string`, () => {
		const result1 = format.date(date1, `yyyy-mm-dd HH:ii:ss`);
		expect(result1).toStrictEqual(`2021-01-10 23:11:09`);

		const result2 = format.date(date2, `DDDD, MMM d, yyyy @htt`);
		expect(result2).toStrictEqual(`Sunday, Nov 5, 2022 @11am`);

		const result3 = format.date(date3, `DDD h:iiTT, MMMM d`);
		expect(result3).toStrictEqual(`Thu 1:00PM, November 1`);
	});
});

describe(`formatString`, () => {
	const inputString = `This is an input string`;
	const inputStrings = [
		{inStr: `This is an input string`},
		{inStr: `This is an input_string`},
		{inStr: `This is an input.string`},
		{inStr: `This is an input,string`},
		{inStr: `This is an input-string`},
	];

	// ------------------------------
	// Argument types
	// ------------------------------
	// ######## inputString ########
	test(`should not throw an error if inputString is a string`, () => {
		expect(() => {
			format.string(inputString, `slug`);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(
		`should throw error if inputString is $type`,
		({type, arg}) => {
			expect(() => {
				format.string(arg, `slug`);
			}).toThrow(TypeError(`$inputString must be a string!`));
		}
	);

	// ######## format ########
	test(`should not throw error if format is a string`, () => {
		expect(() => {
			format.string(inputString, `slug`, ` `);
		}).not.toThrow();
	});

	test.each(testData.type.isNotString)(`should throw error if format is $type`, ({type, arg}) => {
		expect(() => {
			format.string(inputString, arg, ` `);
		}).toThrow(TypeError(`$format must be a string!`));
	});

	// ------------------------------
	// Functionality
	// ------------------------------
	test.each(inputStrings)(`should return camelCaseString if format is camel`, ({inStr}) => {
		const result = format.string(inStr, `camel`);
		expect(result).toStrictEqual(`thisIsAnInputString`);
	});

	test.each(inputStrings)(`should return CapsString if format is caps`, ({inStr}) => {
		const result = format.string(inStr, `caps`);
		expect(result).toStrictEqual(`ThisIsAnInputString`);
	});

	test.each(inputStrings)(`should return lowerstring if format is lower`, ({inStr}) => {
		const result = format.string(inStr, `lower`);
		expect(result).toStrictEqual(`thisisaninputstring`);
	});

	test.each(inputStrings)(`should return slug-string if format is slug`, ({inStr}) => {
		const result = format.string(inStr, `slug`);
		expect(result).toStrictEqual(`this-is-an-input-string`);
	});

	test.each(inputStrings)(`should return snake_string if format is snake`, ({inStr}) => {
		const result = format.string(inStr, `snake`);
		expect(result).toStrictEqual(`this_is_an_input_string`);
	});

	test.each(inputStrings)(`should return UPPER_SNAKE_STRING if format is upperSnake`, ({inStr}) => {
		const result = format.string(inStr, `upperSnake`);
		expect(result).toStrictEqual(`THIS_IS_AN_INPUT_STRING`);
	});
});
