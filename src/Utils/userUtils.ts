import prisma from "../prisma-instance";
import { UserInfo } from "../type";

const isUserLogged = (req: CookieSessionInterfaces.CookieSessionRequest) => {
	return req.session && !req.session.isNew && req.session.userId;
};

const fetchUser = async (userId: number) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			username: true,
			id: true,
			_count: {
				select: {
					decks: true,
				},
			},
		},
	});
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};
const fetchUserInfo = async (userId: number) => {
	const user = await fetchUser(userId);
	const userInfo: UserInfo = {
		username: user.username,
		nbOfDecks: user._count?.decks || 0,
		permissions: [
			"CREATE_DECKS",
			"DELETE_OWN_DECKS",
			"EDIT_OWN_DECKS",
			"READ_DECKS",
		],
		id: user.id,
	};
	return userInfo;
};
export { isUserLogged, fetchUser, fetchUserInfo };
