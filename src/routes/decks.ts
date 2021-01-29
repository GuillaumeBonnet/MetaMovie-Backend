import {
	card,
	cardCreateArgs,
	deck,
	Prisma,
	PrismaClientKnownRequestError,
	cardCreateWithoutDeckInput,
} from "@prisma/client";
import express from "express";
const routerDecks = express.Router();
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { checkDeckInput, decktoDeckApi, getIdFromUrl } from "./decksUtils";
import { CardApi, DeckApi, CreateFields, DeckApi_WithoutCards } from "./type";

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
					cards: deck.cards.map((card: any) => {
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
		try {
			const deck = await prisma.deck.create({
				data: {
					name: body.name,
					languageTag: body.languageTag ?? "EN",
					cards: {
						create: body.cards.map((card: any, index) => {
							card.deckOrder = index;
							delete card.status;
							return card;
						}),
					},
				},
				include: {
					cards: true,
				},
			});
			res.send(decktoDeckApi(deck));
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

		if (!body.cards) {
			next("Deck Should have a property cards: []");
		}
		const cardIdToDelete: number[] = [];
		const cardIds: number[] = [];
		type CardApi_WithOrder = CardApi & { deckOrder: number };
		//todo ajouter deckOrder dans la première boucle, faire un create deck avec create cards et connect cards
		let deckOrderIndex = 0;
		for (const card of body.cards) {
			cardIds.push(card.id);
		}
		const deleteOp = prisma.card.deleteMany({
			where: {
				deckId: {
					equals: deckId,
				},
			},
		});
		const updateOp = prisma.deck.update({
			where: {
				id: deckId,
			},
			data: {
				name: body.name,
				languageTag: body.languageTag,
				cards: {
					create: body.cards.map((card, index: number) => {
						const cardCasted: Prisma.cardCreateWithoutDeckInput = {
							...card,
							deckOrder: index,
						};
						delete (cardCasted as any).id;
						return cardCasted;
					}),
				},
			},
			include: {
				cards: true,
			},
		});

		try {
			const [
				deleteOp_result,
				updateOp_result,
			] = await prisma.$transaction([deleteOp, updateOp]);
			console.log("gboDebug:[deleteOp_result]", deleteOp_result);
			console.log("gboDebug:[updateOp_result]", updateOp_result);
			res.send(updateOp_result);
		} catch (error) {
			console.log("gboDebug:[error]", error);
			next(error);
		}
	}
);

export { routerDecks };
