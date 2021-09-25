import express, { NextFunction, Request, Response } from "express";
import path from "path";
import logger from "morgan";
import { pathDecks, routerDecks } from "./routes/decks";
import { passport, pathUsers, routerUsers } from "./routes/users";
import { deck } from "../node_modules/.prisma/client/index";
import { ValidationError } from "express-json-validator-middleware";
import cors from "cors";
import cookieSession from "cookie-session";
import prisma from "./prisma-instance";
import { user } from "@prisma/client";
import { pathMovies, routerMovies } from "./routes/movies";

const app = express();
app.use(
	cors({
		//To allow requests from client
		origin: ["https://localhost:8080", "https://www.netflix.com"],
		credentials: true,
	})
); //TODO CORS
app.use(logger("dev"));
app.use(
	cookieSession({
		name: "auth-meta-movie",
		keys: ["aa"], //TODO
		maxAge: 24 * 60 * 60 * 1000 * 7, // 1 week
		sameSite: "none",
		secure: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

app.use(pathUsers, routerUsers);
app.use(pathDecks, routerDecks);
app.use(pathMovies, routerMovies);
// Error handler for validation errors
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof ValidationError) {
		// At this point you can execute your error handling code
		res.status(400).send(JSON.stringify(err, null, 2));
		next();
	} else {
		next(err); // pass error on if not a validation error
	}
});

export { app };
