import request from "supertest";
import { app } from "./app";
import prisma from "./prisma-instance";
import {
	deck,
	deckCreateArgs,
	card,
	prismaVersion,
	Subset,
} from ".prisma/client";
import { DSAKeyPairKeyObjectOptions } from "crypto";
import { createDeflate } from "zlib";
import { CardApi, DeckApi, CreateFields } from "./routes/type";

let firstDeck: deck;
let secondDeck: deck;

const parseDates = (obj: {
	updatedAt: string | Date;
	createdAt: string | Date;
}) => {
	obj.createdAt = new Date(obj.createdAt);
	obj.updatedAt = new Date(obj.updatedAt);
};
describe("DECKS", () => {
	beforeEach(async () => {
		if (process.env.NODE_ENV == "production") {
			throw Error("Don't run integration tests on production database.");
		}
		await prisma.card.deleteMany({
			where: {
				id: {
					not: undefined,
				},
			},
		});
		await prisma.deck.deleteMany({
			where: {
				id: {
					not: undefined,
				},
			},
		});
		firstDeck = await prisma.deck.create({
			data: {
				name: "first-deck",
				languageTag: "FR",
				cards: {
					create: [
						{
							deckOrder: 1,
							from: "0:01:00",
							to: "0:01:30",
							positionX: 1,
							positionY: 1,
							text: "firstDeck:card1",
						},
						{
							deckOrder: 2,
							from: "0:02:00",
							to: "0:02:30",
							positionX: 2,
							positionY: 2,
							text: "firstDeck:card2",
						},
					],
				},
			},
		});

		secondDeck = await prisma.deck.create({
			data: {
				name: "second-deck",
				languageTag: "EN",
				cards: {
					create: [
						{
							deckOrder: 1,
							from: "02:01:00",
							to: "02:01:30",
							positionX: 21,
							positionY: 21,
							text: "secondDeck:card1",
						},
						{
							deckOrder: 2,
							from: "02:02:00",
							to: "02:02:30",
							positionX: 22,
							positionY: 22,
							text: "secondDeck:card2",
						},
					],
				},
			},
		});
	});
	afterAll(() => {
		prisma.$disconnect();
	});
	test("It should GET all decks", async () => {
		const response = await request(app).get("/decks");
		const responseBody: DeckApi[] = response.body;
		expect(response.status).toBe(200);
		expect(responseBody.length).toBe(2);
		parseDates(responseBody[0]);
		expect(responseBody[0]).toEqual(
			expect.objectContaining<DeckApi>({
				languageTag: "FR",
				name: "first-deck",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
	});
	test("It should GET 1 deck with cards", async () => {
		const response = await request(app).get(`/decks/${firstDeck.id}`);
		if (response.error) {
			console.log("[error]", response.error);
		}
		console.log("gboDebug:[response.body]", response.body);
		const responseBody: DeckApi = response.body;
		expect(response.status).toBe(200);

		parseDates(responseBody);
		expect(responseBody).toEqual(
			expect.objectContaining<DeckApi>({
				languageTag: "FR",
				name: "first-deck",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
		parseDates(responseBody.cards[0]);
		expect(responseBody.cards[0]).toEqual(
			expect.objectContaining<CardApi>({
				from: "0:01:00",
				to: "0:01:30",
				positionX: 1,
				positionY: 1,
				text: "firstDeck:card1",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
		expect(responseBody.cards[0]).not.toEqual(
			expect.objectContaining({
				deckId: expect.anything(),
				deckOrder: expect.anything(),
			})
		);
		parseDates(response.body.cards[1]);
		expect(response.body.cards[1]).toEqual(
			expect.objectContaining<CardApi>({
				from: "0:02:00",
				to: "0:02:30",
				positionX: 2,
				positionY: 2,
				text: "firstDeck:card2",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
		expect(responseBody.cards[1]).not.toEqual(
			expect.objectContaining({
				deckId: expect.anything(),
				deckOrder: expect.anything(),
			})
		);
	});
	test("POST a deck", async () => {
		const requestBody: CreateFields<DeckApi> = {
			languageTag: "FR",
			name: "my new deck",
		};

		const response = await request(app).post("/decks").send(requestBody);
		expect(response.status).toBe(200);
		parseDates(response.body);
		expect(response.body).toEqual(
			expect.objectContaining({
				...requestBody,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
	});
	test("It should PUT a deck", async () => {
		const jsonInput = {
			name: "first-deck-updated",
		} as DeckApi;

		const response = await request(app)
			.put(`/decks/${firstDeck.id}`)
			.send(jsonInput);
		if (response.error) {
			console.log("[error]", response.error);
		}

		expect(response.status).toBe(200);
		parseDates(response.body);
		expect(response.body).toEqual(
			expect.objectContaining({
				name: jsonInput.name,
				languageTag: "FR",
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				id: expect.any(Number),
			})
		);
		const updatedDeckFromDb = await prisma.deck.findUnique({
			where: {
				id: firstDeck.id,
			},
		});
		expect(jsonInput.name).toBe(updatedDeckFromDb.name);
	});
});
