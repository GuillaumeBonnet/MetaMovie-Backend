import { deck, PrismaClientKnownRequestError } from "@prisma/client";
import express from "express";
const routerDecks = express.Router();
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { checkDeckInput, getIdFromUrl } from "./decksUtils";
import { CardApi, DeckApi } from "./type";

routerDecks.get(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const allDecks = (await prisma.deck.findMany()) as DeckApi[];
			res.send(allDecks);
		} catch (error) {
			console.error("Error when fetching allDecks: ", error);
			//TODO user a logger
			res.sendStatus(500);
		}
	}
);

routerDecks.get(
	"/:deckId",
	async function (req: Request, res: Response, next: NextFunction) {
		const deckId = getIdFromUrl("deckId", req, res, next);

		try {
			const deck = await prisma.deck.findUnique({
				where: {
					id: deckId,
				},
				include: {
					cards: {
						orderBy: {
							deckOrder: "asc",
						},
					},
				},
			});
			if (!deck) {
				next("Deck no found.");
			} else {
				const deckApi: DeckApi = {
					...deck,
					cards: deck.cards.map((card: unknown) => {
						delete (card as any).deckId;
						delete (card as any).deckOrder;
						return card as CardApi;
					}),
				};
				res.send(deckApi);
			}
		} catch (error) {
			next(error);
		}
	}
);

routerDecks.post(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		const body = checkDeckInput(req, res, next);
		if (body.id) {
			next("POST operation doesn't use id.");
		}
		const newDeck = {
			name: body.name,
			languageTag: body.languageTag ?? "EN",
		} as deck;

		try {
			const deck = await prisma.deck.create({
				data: newDeck,
			});
			res.send(deck);
		} catch (error) {
			next(error);
		}
	}
);

routerDecks.put(
	"/:deckId",
	async function (req: Request, res: Response, next: NextFunction) {
		const body = checkDeckInput(req, res, next);
		const deckId = getIdFromUrl("deckId", req, res, next);

		const deckToUpdt = {
			name: body.name,
			languageTag: body.languageTag,
		} as deck;

		try {
			const deck = await prisma.deck.update({
				where: {
					id: deckId,
				},
				data: deckToUpdt,
			});
			res.send(deck);
		} catch (error) {
			next(error);
		}
	}
);

export { routerDecks };
