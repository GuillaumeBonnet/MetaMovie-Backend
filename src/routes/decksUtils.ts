import { card, deck } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { CardApi, DeckApi, DeckApi_WithoutCards } from "../type";

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
export { getIdFromUrl };
