import { hash } from "bcrypt";
import { Request } from "express";
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

const hashPassword = async (password: string) => {
	return await hash(password, 10);
};

const activateUserIfRight = async (req: Request) => {
	const userId = Number.parseInt(req.params.userId);
	const validationNumber = Number.parseInt(req.params.validationNumber);
	if(!userId) {
		throw "UserId not found." ;
	}
	if(!validationNumber) {
		throw "Validation number not found." ;
	}
	const user = await prisma.user.findUnique({
		where: {
			id:  userId
		},
		select: {
			id: true,
			isActive: true,
			confirmEmailUserToken: true
		}
	});
	if(!user) {
		throw "UserId not found.";
	}
	if(user.confirmEmailUserToken[0].randomNumber != validationNumber) {
		throw "Wrong validation Number." ;
	}
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			isActive: true
		}
	});
	await prisma.confirmEmailUserToken.delete({
		where: {
			userId: user.id
		}
	});
}
export { isUserLogged, fetchUser, fetchUserInfo, hashPassword, activateUserIfRight };
