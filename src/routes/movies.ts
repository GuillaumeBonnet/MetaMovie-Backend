import { card, movie, Prisma } from "@prisma/client";
import express from "express";
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import {
	CardApi,
	CreateFields,
	CardApi_Createable,
	MovieAndCount,
} from "../type";
import { bodyValidator } from "../Services/bodyValidator";
import { getRole, hasPermission, permissionMap } from "../Services/Permissions";

const routerMovies = express.Router();
const pathMovies = "/movies";

routerMovies.get(
	"/",
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			const movies = await prisma.movie.findMany({
				select: {
					name: true,
					netflixId: true,
					_count: {
						select: {
							decks: true,
						},
					},
				},
			});
			const movieList: MovieAndCount[] = movies.map((movie) => {
				return {
					name: movie.name,
					nbDecks: movie._count?.decks || 0,
					netflixId: movie.netflixId,
				};
			});
			res.send(movieList);
		} catch (error) {
			console.error("Error when fetching allMovies: ", error);
			//TODO user a logger
			res.sendStatus(500);
		}
	}
);

export { routerMovies, pathMovies };
