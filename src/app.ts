import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { routerIndex } from "./routes/index";
import { routerDecks } from "./routes/decks";
import { deck } from "../node_modules/.prisma/client/index";
import { ValidationError } from "express-json-validator-middleware";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routerIndex);
app.use("/decks", routerDecks);
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
