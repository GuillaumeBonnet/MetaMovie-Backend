#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { app } from "../app";
import debugObj from "debug";
import http from "http";
import https from "https";
import fs from "fs/promises";

var debugFunc = debugObj("metamovie-backend:server");
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

var server: https.Server;

/**
 * Create HTTPS server.
 */
Promise.all([
	fs.readFile("src/bin/certs/localhost.key"),
	fs.readFile("src/bin/certs/localhost.crt"),
]).then(([key, cert]) => {
	const options = {
		key,
		cert,
	};
	server = https.createServer(options, app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */

	server.listen(port);
	server.on("error", onError);
	server.on("listening", onListening);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	if (!addr) {
		debugFunc("Error while reading address for logs.");
		return;
	}
	var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	debugFunc("Listening on " + bind);
}
