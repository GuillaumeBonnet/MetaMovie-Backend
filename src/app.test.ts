import request from "supertest";
import { app } from "./app";
import prisma from "./prisma-instance";
import {
	deck,
	deckCreateArgs,
	Subset,
} from "../node_modules/.prisma/client/index";

describe("DECKS", () => {
	test("It should GET all decks", async () => {
		const deckMock = {
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
			id: 1,
			languageTag: "fr",
			name: "first-deck",
		} as deck;
		const prismaMock = jest
			.spyOn(prisma.deck, "findMany")
			.mockImplementation(async () => {
				return [deckMock];
			});
		const response = await request(app).get("/decks");
		expect(response.status).toBe(200);
		expect(prismaMock).toHaveBeenCalledTimes(1);
		expect(response.body).toEqual(
			expect.arrayContaining<deck>(JSON.parse(JSON.stringify([deckMock])))
		);
	});
	test("POST a deck", async () => {
		const requestBody: Partial<deck> = {
			languageTag: "FR",
			name: "my new deck",
		};
		const mockedReponse = {
			...requestBody,
			createdAt: new Date(),
			updatedAt: new Date(),
			id: 1,
		} as deck;

		const tmp = prisma.deck.create(
			requestBody as Subset<deckCreateArgs, deckCreateArgs>
		);
		type Prisma__deckClient = typeof tmp;
		const prismaMock = jest
			.spyOn(prisma.deck, "create")
			.mockImplementation(
				(arg1: Subset<deckCreateArgs, deckCreateArgs>) => {
					return Promise.resolve(mockedReponse) as Prisma__deckClient;
				}
			);

		const response = await request(app).post("/decks").send(requestBody);

		console.log("gboDebug:[response]", response.body);
		expect(response.status).toBe(200);
		expect(prismaMock).toHaveBeenCalledTimes(1);
		expect(response.body).toEqual(
			expect.objectContaining<deck>(
				JSON.parse(JSON.stringify(mockedReponse))
			)
		);
	});
});
