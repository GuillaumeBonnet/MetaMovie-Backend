import express from "express";
const routerDecks = express.Router();
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";

routerDecks.get(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		prisma.deck
			.findMany()
			.then((allDecks) => {
				res.send(allDecks);
			})
			.catch((error) => {
				console.error("Error when fetching allDecks: ", error);
				//TODO user a logger
				res.sendStatus(500);
			});
	}
);

routerDecks.post(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		const deck = await prisma.deck.create({
			data: {
				name: req.body.name,
			},
		});
		res.send(deck);
	}
);

export { routerDecks };
