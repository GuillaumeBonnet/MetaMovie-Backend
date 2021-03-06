import { card, deck, Prisma } from "@prisma/client";
import express from "express";
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { deckToApiFormat, getIdFromUrl } from "../Utils/decksUtils";
import { fetchUser, isUserLogged } from "../Utils/userUtils";
import {
	CardApi,
	DeckApi,
	CreateFields,
	DeckApi_WithoutCards,
	DeckApi_Createable,
	CardApi_Createable,
} from "../type";
import { bodyValidator } from "../Services/bodyValidator";
import {
	getDeckPermissions,
	getRole,
	hasPermission,
	permissionMap,
} from "../Services/Permissions";

const routerDecks = express.Router();
const pathDecks = "/decks";

routerDecks.get(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		if (!hasPermission(req, "READ_DECKS")) {
			return res
				.status(404)
				.send({ message: "No permission to 'READ_DECKS" });
		}
		const parseToNumberOrNull = (queryParam: string) => {
			if (Number.isInteger(Number.parseInt(queryParam))) {
				return Number.parseInt(queryParam);
			} else {
				return null;
			}
		};
		const handledParams = {
			movieId: parseToNumberOrNull("" + req.query.movieId),
			userId: parseToNumberOrNull("" + req.query.userId),
		};

		const whereClause: Prisma.deckWhereInput = {};
		if (handledParams.movieId) {
			whereClause.movieId = handledParams.movieId;
		}
		if (handledParams.userId) {
			whereClause.userId = handledParams.userId;
		}
		//TODO Prisma.validator<Prisma.deckWhereInput>
		try {
			const allDecks: DeckApi_WithoutCards[] = (
				await prisma.deck.findMany({
					select: {
						_count: {
							select: {
								cards: true,
							},
						},
						user: {
							select: {
								username: true,
								id: true,
							},
						},
						userId: true,
						id: true,
						createdAt: true,
						updatedAt: true,
						languageTag: true,
						name: true,
						movie: {
							select: {
								name: true,
								netflixId: true,
							},
						},
						description: true,
					},
					where: whereClause,
				})
			).map((deck) => {
				return {
					...deck,
					languageTag: deck.languageTag as DeckApi["languageTag"],
					permissions: getDeckPermissions(deck, req.session?.userId),
					numberOfCards: deck._count?.cards || 0,
					ownerName: deck.user.username,
					movie: {
						id: deck.movie.netflixId,
						title: deck.movie.name,
					},
				};
			});
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
		if (!hasPermission(req, "READ_DECKS")) {
			return res
				.status(404)
				.send({ message: "No permission to 'READ_DECKS" });
		}
		const deckId = getIdFromUrl("deckId", req, res, next);

		try {
			const deck = await prisma.deck.findUnique({
				where: {
					id: deckId,
				},
				include: {
					movie: {
						select: {
							name: true,
							netflixId: true,
						},
					},
					cards: {
						select: {
							from: true,
							to: true,
							positionX: true,
							positionY: true,
							text: true,
							id: true,
							createdAt: true,
							updatedAt: true,
							deckOrder: true,
							deckId: true,
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
				res.send(deckToApiFormat(deck, req.session?.userId));
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
		if (!hasPermission(req, "CREATE_DECKS")) {
			return res
				.status(404)
				.send({ message: "No permission to 'CREATE_DECKS" });
		}
		const body: DeckApi_Createable = req.body;
		if (!body.name) {
			return res
				.status(404)
				.send({ message: "Deck name cannot be empty" });
		}
		const deckWithSameName = await prisma.deck.findFirst({
			where: {
				name: body.name,
			},
		});
		if (deckWithSameName) {
			return res.status(404).send({
				message: `There is already a deck with the name ${body.name}`,
			});
		}
		try {
			let movieInDb = await prisma.movie.findUnique({
				where: {
					netflixId: body.movie.id,
				},
				select: {
					name: true,
					netflixId: true,
				},
			});
			if (!movieInDb) {
				movieInDb = await prisma.movie.create({
					data: {
						name: body.movie.title,
						netflixId: body.movie.id,
					},
				});
			}
			const deck = await prisma.deck.create({
				data: {
					name: body.name,
					description: body.description,
					languageTag: body.languageTag ?? "EN",
					cards: {
						create: body.cards.map((card, index) => {
							return {
								deckOrder: index,
								from: card.from,
								to: card.to,
								positionX: card.position.x,
								positionY: card.position.y,
								text: card.text,
							};
						}),
					},
					user: {
						connect: {
							id: req.session?.userId,
						},
					},
					movie: {
						connect: {
							netflixId: movieInDb.netflixId,
						},
					},
				},
				include: {
					movie: {
						select: {
							name: true,
							netflixId: true,
						},
					},
					cards: {
						select: {
							from: true,
							to: true,
							positionX: true,
							positionY: true,
							text: true,
							id: true,
							createdAt: true,
							updatedAt: true,
							deckOrder: true,
							deckId: true,
						},
						orderBy: {
							deckOrder: "asc",
						},
					},
					user: true,
				},
			});
			res.send(deckToApiFormat(deck, req.session?.userId));
		} catch (error) {
			next(error);
		}
	}
);
routerDecks.put(
	"/:deckId",
	bodyValidator("DeckApi"),
	async function (req: Request, res: Response, next: NextFunction) {
		if (!hasPermission(req, "EDIT_OWN_DECKS")) {
			return res
				.status(404)
				.send({ message: "No permission to 'EDIT_OWN_DECKS" });
		}
		if (!req.session) {
			throw Error("Session Error");
		}
		const userLogged = await fetchUser(req.session.userId);
		const body: DeckApi = req.body;
		const deckId = getIdFromUrl("deckId", req, res, next);
		const deck = await prisma.deck.findUnique({
			where: {
				id: deckId,
			},
			include: {
				user: true,
			},
		});
		if (!deck) {
			return res.status(404).send({
				message: `Deck ${deckId} not Found.`,
			});
		}
		if (deck.userId != userLogged.id) {
			return res.status(404).send({
				message: `Cannot update a deck of another User.`,
			});
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
				languageTag: body.languageTag || undefined,
				cards: {
					create: body.cards.map((card, index: number) => {
						const cardCasted: Prisma.cardCreateWithoutDeckInput = {
							from: card.from,
							to: card.to,
							positionX: card.position.x,
							positionY: card.position.y,
							text: card.text,
							deckOrder: index,
						};
						return cardCasted;
					}),
				},
			},
			include: {
				movie: {
					select: {
						name: true,
						netflixId: true,
					},
				},
				cards: {
					select: {
						from: true,
						to: true,
						positionX: true,
						positionY: true,
						text: true,
						id: true,
						createdAt: true,
						updatedAt: true,
						deckOrder: true,
						deckId: true,
					},
					orderBy: {
						deckOrder: "asc",
					},
				},
			},
		});
		try {
			const [deleteOp_result, updateOp_result] =
				await prisma.$transaction([deleteOp, updateOp]);
			res.send(deckToApiFormat(updateOp_result, req.session?.userId));
		} catch (error) {
			console.log("[error]", error);
			next(error);
		}
	}
);

routerDecks.delete(
	"/:deckId",
	async function (req: Request, res: Response, next: NextFunction) {
		if (!hasPermission(req, "DELETE_OWN_DECKS")) {
			return res
				.status(404)
				.send({ message: "No permission to 'DELETE_OWN_DECKS" });
		}
		const deckId = getIdFromUrl("deckId", req, res, next);
		const deleteCardsOp = prisma.card.deleteMany({
			where: {
				deckId: {
					equals: deckId,
				},
			},
		});
		const deleteOp = prisma.deck.delete({
			where: {
				id: deckId,
			},
		});
		try {
			const [deleteCardsOp_result, deleteOp_result] =
				await prisma.$transaction([deleteCardsOp, deleteOp]);
			res.send();
		} catch (error) {
			console.log("[error]", error);
			next(error);
		}
	}
);

export { routerDecks, pathDecks };
