import {
	card,
	deck,
	FindManycardArgs,
	Prisma,
	PrismaClientKnownRequestError,
} from "@prisma/client";
import express from "express";
const routerDecks = express.Router();
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { getIdFromUrl } from "./decksUtils";
import {
	CardApi,
	DeckApi,
	CreateFields,
	DeckApi_WithoutCards,
	DeckApi_Createable,
	CardApi_Createable,
} from "../type";
import { bodyValidator } from "./bodyValidator";

routerDecks.get(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const allDecks: DeckApi_WithoutCards[] = await prisma.deck.findMany();
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
						select: {
							from: true,
							to: true,
							positionX: true,
							positionY: true,
							text: true,
						},
						orderBy: {
							deckOrder: "asc",
						},
					},
				},
			});
			if (!deck) {
				next("Deck not found.");
			} else {
				const deckOut: DeckApi = deck;
				res.send(deckOut);
			}
		} catch (error) {
			next(error);
		}
	}
);

routerDecks.post(
	"/",
	bodyValidator("DeckApi_Createable"),
	async function (req: Request, res: Response, next: NextFunction) {
		const body: DeckApi_Createable = req.body;
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
					cards: {
						select: {
							from: true,
							to: true,
							positionX: true,
							positionY: true,
							text: true,
						},
						orderBy: {
							deckOrder: "asc",
						},
					},
				},
			});
			const deckOut: DeckApi = deck;
			res.send(deckOut);
		} catch (error) {
			next(error);
		}
	}
);
routerDecks.put(
	"/:deckId",
	bodyValidator("DeckApi"),
	async function (req: Request, res: Response, next: NextFunction) {
		const body: DeckApi = req.body;
		const deckId = getIdFromUrl("deckId", req, res, next);
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
				languageTag: body.languageTag || undefined,
				cards: {
					create: body.cards.map((card, index: number) => {
						const cardCasted: Prisma.cardCreateWithoutDeckInput = {
							from: card.from,
							to: card.to,
							positionX: card.positionX,
							positionY: card.positionY,
							text: card.text,
							deckOrder: index,
						};
						return cardCasted;
					}),
				},
			},
			include: {
				cards: {
					select: {
						from: true,
						to: true,
						positionX: true,
						positionY: true,
						text: true,
					},
					orderBy: {
						deckOrder: "asc",
					},
				},
			},
		});
		try {
			const [
				deleteOp_result,
				updateOp_result,
			] = await prisma.$transaction([deleteOp, updateOp]);
			console.log("gboDebug:[updateOp_result]", updateOp_result);
			const deckOut: DeckApi = updateOp_result;
			res.send(deckOut);
		} catch (error) {
			console.log("gboDebug:[error]", error);
			next(error);
		}
	}
);

export { routerDecks };
