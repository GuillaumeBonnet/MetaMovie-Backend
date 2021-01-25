import { deck } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { DeckApi } from "./type";

const checkDeckInput = (req: Request, res: Response, next: NextFunction) => {
	const body = req.body as DeckApi;
	if (!body.name) {
		next("Unexpected JSON");
	}
	return body;
};
const getIdFromUrl = (
	paramName: string,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (
		!req.params.deckId ||
		!Number.isInteger(Number.parseInt(req.params[paramName]))
	) {
		next("Unexpected id in url.");
	}
	return Number.parseInt(req.params[paramName]);
};
export { checkDeckInput, getIdFromUrl };
