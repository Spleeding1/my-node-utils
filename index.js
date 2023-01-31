/**
 * @package my-node-utils
 * index.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 *
 * Utility functions for commonly used things.
 */

const myBools = require(`./my-bools`);
exports[`myBools`] = myBools;

const myClock = require(`./my-clock`);
exports[`myClock`] = myClock;

const myFormatting = require(`./my-formatting`);
exports[`myFormatting`] = myFormatting;

const myFS = require(`./my-fs`);
exports[`myFS`] = myFS;

const myJSON = require(`./my-JSON`);
exports[`myJSON`] = myJSON;

const myMessages = require(`./my-messages`);
exports[`myMessages`] = myMessages;

const myTestData = require(`./tests/test-data/type-testing`);
exports[`myTestData`] = myTestData;

module.exports = exports;
