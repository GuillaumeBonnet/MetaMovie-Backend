#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { app } from "../app";
import debugObj from "debug";
import http from "http";
import https from "https";
import fs from "fs/promises";

let debugFunc = debugObj("metamovie-backend:server");
/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const launchServer = async () => {
	if (process.env.NODE_ENV == "production") {
		return http.createServer(app);
	} else {
		// local env
		const [key, cert] = await Promise.all([
			fs.readFile("src/bin/certs/localhost.key"),
			fs.readFile("src/bin/certs/localhost.crt"),
		]);
		return https.createServer(
			{
				key,
				cert,
			},
			app
		);
	}
};

launchServer()
	.then((server) => {
		server.listen(port);
		server.on("error", onError);
		server.on("listening", onListening);

		function onListening() {
			let addr = server.address();
			if (!addr) {
				debugFunc("Error while reading address for logs.");
				return;
			}
			let bind =
				typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
			debugFunc("Listening on " + bind);
		}
	})
	.catch((error) => {
		console.log("[error launching server]", error);
	});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
	let port = parseInt(val, 10);
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
	console.log("gboDebug:[onError]", error);
	if (error.syscall !== "listen") {
		throw error;
	}

	let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
