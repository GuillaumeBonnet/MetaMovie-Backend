import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

async function main() {
	const avgJoe = await prisma.user.upsert({
		where: { email: "joe.average@metamovie.com.invalid" },
		update: {},
		create: {
			email: "joe.average@metamovie.com.invalid",
			username: "avgJoe",
			passwordHash: await hash("password", 10),
			isActive: true,
		},
	});

	const janeDoe = await prisma.user.upsert({
		where: { email: "jane.doe@metamovie.com.invalid" },
		update: {},
		create: {
			email: "jane.doe@metamovie.com.invalid",
			username: "janeDoe",
			passwordHash: await hash("password", 10),
			isActive: true,
		},
	});

	/* -------------------------------------------------------------------------- */
	/*                               No Longer Here                               */
	/* -------------------------------------------------------------------------- */
	const cumbriaFilm = await prisma.movie.upsert({
		where: {
			netflixId: 81025595,
		},
		create: {
			name: "I'm No Longer Here",
			netflixId: 81025595,
		},
		update: {},
	});

	const deckCumbria = await prisma.deck.upsert({
		where: {
			id: 3,
		},
		create: {
			id: 3,
			name: "No longer Here(jane's deck)",
			description:
				"Trivia and information from the imdb page: \nhttps://www.imdb.com/title/tt4323594/trivia/?ref_=tt_trv_trv",
			languageTag: "en",
			movieId: 81025595,
			userId: janeDoe.id,
			cards: {
				createMany: {
					data: [
						{
							deckOrder: 0,
							text: "The cast is largely comprised of non-actors.",
							from: "0:00:00",
							to: "0:00:30",
							positionX: 50,
							positionY: 50,
						},
						{
							deckOrder: 1,
							text: "The script won the 2013 Bengala award, and was published in short story form. The next year the script was selected for the Sundance Screenwriters Lab won the Gabriel Figueroa Development Grant at Los Cabos Film Festival.",
							from: "0:00:20",
							to: "0:01:00",
							positionX: 50,
							positionY: 75,
						},
					],
				},
			},
		},
		update: {},
	});
	/* -------------------------------------------------------------------------- */
	/*                                   Zodiac                                   */
	/* -------------------------------------------------------------------------- */
	const zodiacFilm = await prisma.movie.upsert({
		where: {
			netflixId: 70044686,
		},
		create: {
			name: "Zodiac",
			netflixId: 70044686,
		},
		update: {},
	});

	await prisma.card.deleteMany({
		where: {
			deckId: 4,
		},
	});

	const deckZodiacJane = await prisma.deck.upsert({
		where: {
			id: 4,
		},
		create: {
			id: 4,
			name: "Zodiac(jane's deck)",
			description:
				"Trivia and information from the imdb page: \nhttps://www.imdb.com/title/tt0443706/?ref_=fn_al_tt_1",
			languageTag: "en",
			movieId: 70044686,
			userId: janeDoe.id,
			cards: {
				createMany: {
					data: [
						{
							deckOrder: 0,
							from: "0:22:15",
							to: "0:22:20",
							text: "The murder victims' costumes were meticulously recreated from forensic evidence that was lent to the production.",
							positionX: 75.51,
							positionY: 33.22,
						},
						{
							deckOrder: 1,
							from: "0:43:39",
							to: "0:43:45",
							text: "the theme music is that used by National Nine News (Australia) in the 80s and 90s.",
							positionX: 32.26,
							positionY: 31.19,
						},
						{
							deckOrder: 2,
							from: "0:52:54",
							to: "0:52:56",
							text: "The year is 1969 yet this book has a barcode when they started to be seen in stores after 1974",
							positionX: 46.2,
							positionY: 68.23,
						},
						{
							deckOrder: 3,
							from: "2:31:10",
							to: "2:31:13",
							text: "Those books are the one Robert Graysmith published in real life.",
							positionX: 51,
							positionY: 21.86,
						},
						{
							deckOrder: 4,
							from: "2:33:32",
							to: "2:33:42",
							text: 'The only real comment that Robert Graysmith said about the finished screenplay was, "God, now I see why my wife divorced me."',
							positionX: 50,
							positionY: 50,
						},
					],
				},
			},
		},
		update: {
			id: 4,
			name: "Zodiac(jane's deck)",
			description:
				"Trivia and information from the imdb page: \nhttps://www.imdb.com/title/tt0443706/?ref_=fn_al_tt_1",
			languageTag: "en",
			movieId: 70044686,
			userId: janeDoe.id,
			cards: {
				createMany: {
					data: [
						{
							deckOrder: 0,
							from: "0:22:15",
							to: "0:22:20",
							text: "The murder victims' costumes were meticulously recreated from forensic evidence that was lent to the production.",
							positionX: 75.51,
							positionY: 33.22,
						},
						{
							deckOrder: 1,
							from: "0:43:39",
							to: "0:43:45",
							text: "the theme music is that used by National Nine News (Australia) in the 80s and 90s.",
							positionX: 32.26,
							positionY: 31.19,
						},
						{
							deckOrder: 2,
							from: "0:52:54",
							to: "0:52:56",
							text: "The year is 1969 yet this book has a barcode when they started to be seen in stores after 1974",
							positionX: 46.2,
							positionY: 68.23,
						},
						{
							deckOrder: 3,
							from: "2:31:10",
							to: "2:31:13",
							text: "Those books are the one Robert Graysmith published in real life.",
							positionX: 51,
							positionY: 21.86,
						},
						{
							deckOrder: 4,
							from: "2:33:32",
							to: "2:33:42",
							text: 'The only real comment that Robert Graysmith said about the finished screenplay was, "God, now I see why my wife divorced me."',
							positionX: 50,
							positionY: 50,
						},
					],
				},
			},
		},
	});
}

export const seed = async () => {
	// Prisma create query to seed models in database
	main()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
			process.exit(0);
		});
};
seed();
