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
		},
	});
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};
const fetchUserInfo = async (userId: number) => {
	const user = {
		username: (await fetchUser(userId)).username,
	};
	const userInfo: UserInfo = {
		username: user.username,
		permissions: [
			"CREATE_DECKS",
			"DELETE_OWN_DECKS",
			"EDIT_OWN_DECKS",
			"READ_DECKS",
		],
	};
	return userInfo;
};
export { isUserLogged, fetchUser, fetchUserInfo };
