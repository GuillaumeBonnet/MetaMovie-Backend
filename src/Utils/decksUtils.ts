import { card, deck } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getDeckPermissions, Role } from "../Services/Permissions";
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
		cards: card[];
	},
	userId: number
) => {
	const deckApi: DeckApi = {
		permissions: getDeckPermissions(deck, userId),
		cards: deck.cards.map((card) => {
			return {
				from: card.from,
				to: card.to,
				text: card.text,
				position: {
					x: card.positionX,
					y: card.positionY,
				},
				id: card.id,
			};
		}),
		createdAt: deck.createdAt,
		updatedAt: deck.updatedAt,
		id: deck.id,
		languageTag: deck.languageTag,
		name: deck.name,
	};
	return deckApi;
};
export { getIdFromUrl, deckToApiFormat };
