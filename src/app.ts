import express, { NextFunction, Request, Response } from "express";
import path from "path";
import logger from "morgan";
import { pathDecks, routerDecks } from "./routes/decks";
import { passport, pathUsers, routerUsers } from "./routes/users";
import { ValidationError } from "express-json-validator-middleware";
import cors from "cors";
import cookieSession from "cookie-session";
import { pathMovies, routerMovies } from "./routes/movies";

export class FunctionnalError extends Error {
	constructor(functionnalMessage: string) {
		super(functionnalMessage);
		this.functionnalMessage = functionnalMessage;
	}
	public functionnalMessage: string;
}
const app = express();
app.set("trust proxy", 1);
app.use((request, response, next) => {
	console.log("gboDebug:[request.url]", request.url);
	next();
});
app.use(
	cors({
		//To allow requests from client
		origin: ["https://localhost:8080", "https://www.netflix.com"],
		credentials: true,
	})
);
app.use(logger("dev"));
if (typeof process.env.COOKIE_KEYS != "string") {
	// COOKIE_KEYS=["currentCookieKey", "oldCookieKey"]
	throw Error("env variable COOKIE_KEYS needs to be provided");
}
const cookieKeys = JSON.parse(process.env.COOKIE_KEYS);
if (typeof cookieKeys != "object" || !Array.isArray(cookieKeys)) {
	throw Error("COOKIE_KEYS needs to be an array");
}
app.use(
	cookieSession({
		name: "auth-meta-movie",
		keys: cookieKeys,
		maxAge: 24 * 60 * 60 * 1000 * 7, // 1 week
		sameSite: "none",
		secure: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(pathUsers, routerUsers);
app.use(pathDecks, routerDecks);
app.use(pathMovies, routerMovies);
// Error handler for validation errors
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof ValidationError) {
		// At this point you can execute your error handling code
		res.status(400).send(JSON.stringify(err, null, 2));
		next();
	} else if (err instanceof FunctionnalError) {
		return res.status(400).json({ message: err.functionnalMessage });
	} else {
		next(err); // pass error on if not a validation error
	}
});
app.use("/static", express.static(path.join(__dirname, "../static")));

export { app };
