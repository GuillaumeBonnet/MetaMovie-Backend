// import request from "supertest";
// import { app } from "../app";
// import prisma from "../prisma-instance";
// import {
// 	deck,
// 	deckCreateArgs,
// 	card,
// 	prismaVersion,
// 	Subset,
// } from ".prisma/client";
// import { DSAKeyPairKeyObjectOptions } from "crypto";
// import { createDeflate } from "zlib";
// import {
// 	CardApi,
// 	DeckApi,
// 	DeckApi_WithoutCards,
// 	DeckApi_Createable,
// 	CardApi_Createable,
// } from "../type";

// let firstDeck: deck & {
// 	cards: card[];
// };
// let secondDeck: deck & {
// 	cards: card[];
// };

// const parseDates = (obj: {
// 	updatedAt: string | Date;
// 	createdAt: string | Date;
// }) => {
// 	obj.createdAt = new Date(obj.createdAt);
// 	obj.updatedAt = new Date(obj.updatedAt);
// };
// describe("DECKS", () => {
// 	beforeEach(async () => {
// 		// if (process.env.NODE_ENV == "production") {
// 		// 	throw Error("Don't run integration tests on production database.");
// 		// }
// 		// await prisma.card.deleteMany({
// 		// 	where: {
// 		// 		id: {
// 		// 			not: undefined,
// 		// 		},
// 		// 	},
// 		// });
// 		// await prisma.deck.deleteMany({
// 		// 	where: {
// 		// 		id: {
// 		// 			not: undefined,
// 		// 		},
// 		// 	},
// 		// });
// 		// firstDeck = await prisma.deck.create({
// 		// 	data: {
// 		// 		name: "first-deck",
// 		// 		languageTag: "FR",
// 		// 		cards: {
// 		// 			create: [
// 		// 				{
// 		// 					deckOrder: 1,
// 		// 					from: "0:01:00",
// 		// 					to: "0:01:30",
// 		// 					positionX: 1,
// 		// 					positionY: 1,
// 		// 					text: "firstDeck:card1",
// 		// 				},
// 		// 				{
// 		// 					deckOrder: 2,
// 		// 					from: "0:02:00",
// 		// 					to: "0:02:30",
// 		// 					positionX: 2,
// 		// 					positionY: 2,
// 		// 					text: "firstDeck:card2",
// 		// 				},
// 		// 			],
// 		// 		},
// 		// 	},
// 		// 	include: {
// 		// 		cards: true,
// 		// 	},
// 		// });

// 		// secondDeck = await prisma.deck.create({
// 		// 	data: {
// 		// 		name: "second-deck",
// 		// 		languageTag: "EN",
// 		// 		cards: {
// 		// 			create: [
// 		// 				{
// 		// 					deckOrder: 1,
// 		// 					from: "2:01:00",
// 		// 					to: "2:01:30",
// 		// 					positionX: 21,
// 		// 					positionY: 21,
// 		// 					text: "secondDeck:card1",
// 		// 				},
// 		// 				{
// 		// 					deckOrder: 2,
// 		// 					from: "2:02:00",
// 		// 					to: "2:02:30",
// 		// 					positionX: 22,
// 		// 					positionY: 22,
// 		// 					text: "secondDeck:card2",
// 		// 				},
// 		// 			],
// 		// 		},
// 		// 	},
// 		// 	include: {
// 		// 		cards: true,
// 		// 	},
// 		});
// 	});
// 	afterAll(() => {
// 		prisma.$disconnect();
// 	});
// 	test("It should GET all decks", async () => {
// 		const response = await request(app).get("/decks");
// 		const responseBody: DeckApi[] = response.body;
// 		expect(response.status).toBe(200);
// 		expect(responseBody.length).toBe(2);
// 		parseDates(responseBody[0]);
// 		expect(responseBody[0]).toEqual(
// 			expect.objectContaining<DeckApi_WithoutCards>({
// 				languageTag: "FR",
// 				name: "first-deck",
// 				createdAt: expect.any(Date),
// 				updatedAt: expect.any(Date),
// 				id: expect.any(Number),
// 			})
// 		);
// 	});
// 	test("It should GET 1 deck with cards", async () => {
// 		const response = await request(app).get(`/decks/${firstDeck.id}`);
// 		if (response.error) {
// 			console.log("[error]", response.error);
// 		}
// 		const responseBody: DeckApi = response.body;
// 		expect(response.status).toBe(200);

// 		parseDates(responseBody);
// 		expect(responseBody).toEqual<DeckApi>(
// 			expect.objectContaining({
// 				languageTag: "FR",
// 				name: "first-deck",
// 				createdAt: expect.any(Date),
// 				updatedAt: expect.any(Date),
// 				id: expect.any(Number),
// 				cards: expect.any(Array),
// 			})
// 		);
// 		expect(responseBody.cards[0]).toEqual(
// 			expect.objectContaining<CardApi_Createable>({
// 				from: "0:01:00",
// 				to: "0:01:30",
// 				position: {
// 					x: 1,
// 					y: 1,
// 				},
// 				text: "firstDeck:card1",
// 			})
// 		);
// 		expect((responseBody.cards[0] as any).deckOrder).toBeFalsy();
// 		expect((responseBody.cards[0] as any).deckId).toBeFalsy();
// 		expect((responseBody.cards[0] as any).createdAt).toBeFalsy();
// 		expect((responseBody.cards[0] as any).updatedAt).toBeFalsy();
// 		expect(response.body.cards[1]).toEqual(
// 			expect.objectContaining<CardApi_Createable>({
// 				from: "0:02:00",
// 				to: "0:02:30",
// 				position: { x: 2, y: 2 },
// 				text: "firstDeck:card2",
// 			})
// 		);
// 		expect(responseBody.cards[1]).not.toEqual(
// 			expect.objectContaining({
// 				deckId: expect.anything(),
// 				deckOrder: expect.anything(),
// 			})
// 		);
// 	});
// 	test("POST a deck", async () => {
// 		const requestBody: DeckApi_Createable = {
// 			languageTag: "FR",
// 			name: "my new deck",
// 			cards: [
// 				{
// 					from: "0:12:01",
// 					to: "0:12:02",
// 					position: {
// 						x: 51,
// 						y: 52,
// 					},
// 					text: "first new card",
// 				},
// 				{
// 					from: "0:22:01",
// 					to: "0:22:02",
// 					position: {
// 						x: 61,
// 						y: 62,
// 					},
// 					text: "second new card",
// 				},
// 			],
// 		};

// 		const response = await request(app).post("/decks").send(requestBody);
// 		console.log("gboDebug:[responseBody1]", response.body);
// 		expect(response.status).toBe(200);
// 		const responseBody = response.body as DeckApi;
// 		parseDates(response.body);
// 		expect(responseBody).toEqual(
// 			expect.objectContaining<DeckApi_WithoutCards>({
// 				createdAt: expect.any(Date),
// 				updatedAt: expect.any(Date),
// 				id: expect.any(Number),
// 				languageTag: "FR",
// 				name: "my new deck",
// 			})
// 		);
// 		expect(responseBody.cards.length).toBe(2);
// 		expect((responseBody.cards[0] as any).createdAt).toBeFalsy();
// 		expect(responseBody.cards[0].text).toBe("first new card");
// 		expect(responseBody.cards[1].text).toBe("second new card");
// 	});
// 	test("It should PUT a deck", async () => {
// 		const jsonInput: DeckApi = {
// 			name: "first-deck-updated",
// 			languageTag: null,
// 			cards: [
// 				{
// 					from: "0:12:01",
// 					to: "0:12:02",
// 					position: {
// 						x: 51,
// 						y: 52,
// 					},
// 					id: -1,
// 					text: "first new card",
// 				},
// 				{
// 					from: "0:22:01",
// 					to: "0:22:02",
// 					position: {
// 						x: 61,
// 						y: 62,
// 					},
// 					id: -1,
// 					text: "firstDeck:card1:became:2",
// 				},
// 			],
// 			createdAt: new Date(-1),
// 			updatedAt: new Date(-1),
// 			id: -1,
// 		};

// // 		const response = await request(app)
// // 			.put(`/decks/${firstDeck.id}`)
// // 			.send(jsonInput);
// // 		if (response.error) {
// // 			console.log("[gboDebug error]", response.error);
// // 		}
// // 		console.log("gboDebug:[response.body]", response.body);

// // 		expect(response.status).toBe(200);
// // 		const responseBody: DeckApi = response.body;
// // 		parseDates(responseBody);
// // 		expect(responseBody).toEqual(
// // 			expect.objectContaining({
// // 				name: jsonInput.name,
// // 				languageTag: "FR",
// // 				createdAt: expect.any(Date),
// // 				updatedAt: expect.any(Date),
// // 				id: expect.any(Number),
// // 			})
// // 		);
// // 		const updatedDeckFromDb = await prisma.deck.findUnique({
// // 			where: {
// // 				id: firstDeck.id,
// // 			},
// // 		});
// // 		expect(updatedDeckFromDb.name).toBe(responseBody.name);
// // 		expect(responseBody.name).toBe("first-deck-updated");
// // 		expect(responseBody.cards.length).toBe(2);
// // 		expect(responseBody.cards[0].text).toBe("first new card");
// // 		expect(responseBody.cards[1].text).toBe("firstDeck:card1:became:2");
// // 		expect(
// // 			prisma.card.findUnique({
// // 				where: {
// // 					id: firstDeck.cards[1].id,
// // 				},
// // 			})
// // 		).not.toBeFalsy();
// // 	});
// // });
