import { card, Decimal, deck } from "@prisma/client";
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

const deckToApiFormat = (
	deck: deck & {
		cards?: {
			positionX: number;
			positionY: number;
			from: string;
			text: string;
			to: string;
		}[];
	}
) => {
	if (deck.cards) {
		const deckApi: DeckApi = {
			cards: deck.cards.map((card) => {
				return {
					from: card.from,
					to: card.to,
					text: card.text,
					position: {
						x: card.positionX,
						y: card.positionY,
					},
				};
			}),
			createdAt: deck.createdAt,
			updatedAt: deck.updatedAt,
			id: deck.id,
			languageTag: deck.languageTag,
			name: deck.name,
		};
		return deckApi;
	} else {
		const deckApi: DeckApi_WithoutCards = {
			createdAt: deck.createdAt,
			updatedAt: deck.updatedAt,
			id: deck.id,
			languageTag: deck.languageTag,
			name: deck.name,
		};
		return deckApi;
	}
};
export { getIdFromUrl, deckToApiFormat };
