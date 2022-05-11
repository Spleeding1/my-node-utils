/**
 * @package my-node-utils
 * my-browser-sync.js
 * Copyright (c) 2022 by Carl David Brubaker
 * All Rights Reserved
 * Version: 1.1.2
 *
 * Utility functions for working with browserSync
 *
 * * browserSyncChokidar(proxy, port, watchPaths)
 */

const browserSync = require(`browser-sync`).create();
const chokidar = require(`chokidar`);
const {timer} = require(`./my-clock`);

/**
 * Creates development server.
 * @async
 * @param {string} proxy URL proxy.
 * @param {string} port Port number.
 * @param {string[]} watchPaths Array of paths to watch.
 * @param {function} reloadFunc Function to run on watch. Requires `path` arg.
 */
async function browserSyncChokidar(proxy, port, watchPaths, reloadFunc) {
	browserSync.init({
		proxy: proxy,
		port: port,
	});

	const watcher = chokidar.watch(watchPaths, {ignoreInitial: true});

	watcher.on(`add`, async path => {
		const reloadTime = timer.start();
		await reloadFunc(path);
		browserSync.reload();
		console.info(`\nReloaded in ${timer.stop(reloadTime).green}`.magenta);
	});
	watcher.on(`change`, async path => {
		const reloadTime = startClock();
		await reloadFunc(path);
		browserSync.reload();
		console.info(`\nReloaded in ${timer.stop(reloadTime).green}`.magenta);
	});
	watcher.on(`unlink`, async path => {
		const reloadTime = startClock();
		await reloadFunc(path);
		browserSync.reload();
		console.info(`\nReloaded in ${timer.stop(reloadTime).green}`.magenta);
	});
	watcher.on(`addDir`, () => {
		const reloadTime = startClock();
		browserSync.reload();
		console.info(`\nReloaded in ${timer.stop(reloadTime).green}`.magenta);
	});
	watcher.on(`unlinkDir`, () => {
		const reloadTime = timer.start();
		browserSync.reload();
		console.info(`\nReloaded in ${timer.stop(reloadTime).green}`.magenta);
	});
}

module.exports.browserSyncChokidar = browserSyncChokidar;
