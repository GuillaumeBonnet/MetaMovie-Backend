import { card, deck } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { CardApi, DeckApi, DeckApi_WithoutCards } from "./type";

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
const decktoDeckApi = (
	deck: deck & {
		cards?: card[];
	}
) => {
	if (!deck.cards) {
		const deckApi: DeckApi_WithoutCards = {
			...deck,
		};
		return deckApi as DeckApi_WithoutCards;
	} else {
		const deckApi: DeckApi = {
			...deck,
			cards: deck.cards.map((card: card) => {
				const cardApi = {
					...card,
				} as any;
				delete cardApi.deckId;
				delete cardApi.deckOrder;
				return cardApi as CardApi;
			}),
		};
		return deckApi;
	}
};
export { checkDeckInput, getIdFromUrl, decktoDeckApi };
