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
type DeckApi_WithoutCards = Omit<deck, "userId"> & {
	permissions: ObjectPermission[];
	numberOfCards: number;
};
type DeckApi = Omit<DeckApi_WithoutCards, "numberOfCards"> & {
	cards: Omit<CardApi, "updatedAt" | "createdAt">[];
};
type DeckApi_Createable = Omit<CreateFields<deck>, "userId"> & {
	cards: CardApi_Createable[];
};
// type DeckApi_Update = CreateFields<deck> & { cards: CardApi_Createable[] };

type CreateFields<T> = Omit<T, "id" | "updatedAt" | "createdAt">;
// type UpdateFields<T> = Omit<T, "updatedAt" | "createdAt"> &
// 	Partial<Pick<T, "updatedAt" | "createdAt">>;

type UserInfo = {
	username: string;
	permissions: Permission[];
};
