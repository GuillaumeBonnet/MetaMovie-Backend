import { card, deck } from "@prisma/client";

type CardApi = Omit<card, "deckOrder" | "deckId"> & {
	status?: "new" | "update" | "delete";
	deckOrder?: never;
	deckId?: never;
};
type DeckApi = deck & { cards?: CardApi[] };

type CreateFields<T> = Omit<T, "id" | "updatedAt" | "createdAt" | "deckId">;
