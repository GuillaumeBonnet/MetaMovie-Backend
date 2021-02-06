import { card, deck } from "@prisma/client";

type CardApi = Omit<card, "deckOrder" | "deckId">;
type CardApi_Createable = CreateFields<CardApi>;
type DeckApi = deck & {
	cards: CardApi_Createable[];
};
type DeckApi_WithoutCards = deck;
type DeckApi_Createable = CreateFields<deck> & { cards: CardApi_Createable[] };
// type DeckApi_Update = CreateFields<deck> & { cards: CardApi_Createable[] };

type CreateFields<T> = Omit<T, "id" | "updatedAt" | "createdAt">;
// type UpdateFields<T> = Omit<T, "updatedAt" | "createdAt"> &
// 	Partial<Pick<T, "updatedAt" | "createdAt">>;
