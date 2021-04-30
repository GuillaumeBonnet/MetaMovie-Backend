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
		},
	});
	if (!user) {
		throw new Error("User not found");
	}
	const userInfo: UserInfo = {
		username: user.username,
	};
	return userInfo;
};
export { isUserLogged, fetchUser };
