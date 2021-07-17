import { card, deck } from "@prisma/client";
import { Permission, ObjectPermission } from "./Services/Permissions";

type SignupBody = {
	email: string;
	password: string;
	username: string;
};

type CardApi = Omit<
	card,
	"deckOrder" | "deckId" | "positionX" | "positionY"
> & {
	position: {
		x: number;
		y: number;
	};
};
type CardApi_Createable = CreateFields<CardApi>;
type DeckApi_WithoutCards = Omit<deck, "userId" | "movieId"> & {
	permissions: ObjectPermission[];
	numberOfCards: number;
	ownerName: string;
	movie: { id: number; title: string };
	languageTag:
		| "en"
		| "zh"
		| "hi"
		| "es"
		| "ar"
		| "fr"
		| "pt"
		| "id"
		| "ru"
		| "ru"
		| "bn"
		| "ja"
		| "de";
};
type DeckApi = Omit<DeckApi_WithoutCards, "numberOfCards" | "ownerName"> & {
	cards: Omit<CardApi, "updatedAt" | "createdAt">[];
};
type DeckApi_Createable = CreateFields<DeckApi>;

type CreateFields<T> = Omit<
	T,
	"id" | "updatedAt" | "createdAt" | "permissions"
>;

type UserInfo = {
	username: string;
	nbOfDecks: number;
	permissions: Permission[];
};
