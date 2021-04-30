import { card, deck } from "@prisma/client";

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
type DeckApi = Omit<deck, "userId"> & {
	cards: Omit<CardApi, "updatedAt" | "createdAt">[];
};
type DeckApi_WithoutCards = Omit<deck, "userId">;
type DeckApi_Createable = CreateFields<deck> & { cards: CardApi_Createable[] };
// type DeckApi_Update = CreateFields<deck> & { cards: CardApi_Createable[] };

type CreateFields<T> = Omit<T, "id" | "updatedAt" | "createdAt">;
// type UpdateFields<T> = Omit<T, "updatedAt" | "createdAt"> &
// 	Partial<Pick<T, "updatedAt" | "createdAt">>;

type UserInfo = {
	username: string;
};
