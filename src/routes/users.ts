import { card, deck, Prisma, user } from "@prisma/client";
import express from "express";
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { deckToApiFormat, getIdFromUrl } from "../Utils/decksUtils";
import {
	CardApi,
	DeckApi,
	CreateFields,
	DeckApi_WithoutCards,
	DeckApi_Createable,
	CardApi_Createable,
	SignupBody,
	UserInfo,
	PasswordResetDemandBody,
	PasswordResetConfirmationBody,
} from "../type";
import { bodyValidator } from "../Services/bodyValidator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { send } from "process";
import {
	fetchUser,
	fetchUserInfo,
	hashPassword,
	isUserLogged,
} from "../Utils/userUtils";
import { compare } from "bcrypt";
import { randomBytes } from "crypto";
import { sendResetPasswordEmail } from "../Services/EmailSender";
import { match } from "assert";
const routerUsers = express.Router();
const pathUsers = "/users";

passport.use(
	new LocalStrategy({ usernameField: "email" }, async function (
		email,
		password,
		done
	) {
		console.log("gboDebug:[email]", email);
		console.log("gboDebug:[password]", password);
		try {
			const userInDb = await prisma.user.findUnique({
				where: { email: email },
			});
			if (!userInDb) {
				return done(null, false, { message: "User not found" });
			}
			if (!(await compare(password, userInDb.passwordHash))) {
				return done(null, false, { message: "Wrong password" });
			} else {
				return done(null, userInDb);
			}
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, (user as user).id);
});

passport.deserializeUser(async function (id, done) {
	if (typeof id != "number") {
		return done("Id should be a number", false);
	}
	try {
		const userInDb = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		return done(null, userInDb);
	} catch (err) {
		return done(err);
	}
});

routerUsers.post(
	"/signup",
	bodyValidator("SignupBody"),
	async function (req: Request, res: Response, next: NextFunction) {
		const body: SignupBody = req.body;
		try {
			const user = await prisma.user.create({
				data: {
					email: body.email,
					username: body.username,
					passwordHash: await hashPassword(body.password),
				},
			});
		} catch (error: any) {
			// 'P2002' Unique constraint failed on the {constraint}
			if (error?.code == "P2002") {
				if (error?.meta?.target?.includes("email")) {
					return res
						.status(404)
						.json({ message: "Email is already used." });
				} else if (error?.meta?.target?.includes("username")) {
					return res
						.status(404)
						.json({ message: "Username is already used." });
				}
			}
			return next(error);
		}
		res.sendStatus(200);
	}
);

routerUsers.get("/info", async function (req, res, next) {
	if (!isUserLogged(req)) {
		return res.sendStatus(400);
	}
	try {
		const userInfo = await fetchUserInfo(req.session?.userId);
		return res.send(userInfo);
	} catch (err) {
		return next(err);
	}
});
routerUsers.post("/login", async function (req, res, next) {
	if (isUserLogged(req)) {
		try {
			const userInfo = await fetchUserInfo(req.session?.userId);
			return res.send(userInfo);
		} catch (err) {
			return next(err);
		}
	}
	passport.authenticate("local", function (err, user: user, info) {
		console.log("gboDebug:[err]", err);
		console.log("gboDebug:[user]", user);
		console.log("gboDebug:[info]", info);
		if (err) {
			return next(err);
		}
		if (!user) {
			if (info?.message) {
				return res.status(400).json(info);
			}
			return next("Error");
		}
		req.logIn(user, async function (err) {
			if (err) {
				return next(err);
			}
			console.log("gboDebug:[user]", user);
			req.session = {
				userId: user.id,
			};
			const userInfo = await fetchUserInfo(req.session?.userId);
			return res.send(userInfo);
		});
	})(req, res, next);
});

routerUsers.get("/logout", function (req, res) {
	// req.logout();
	req.session = null;
	res.sendStatus(200);
});

routerUsers.post(
	"/reset-password-demand",
	bodyValidator("PasswordResetDemandBody"),
	async function (req: Request, res: Response, next: NextFunction) {
		const body: PasswordResetDemandBody = req.body;
		const userFromEmail = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});
		if (!userFromEmail) {
			return res.status(400).json({
				message: `No user found with email ${body.email}`,
			});
		}

		const passwordResetToken = await prisma.passwordResetToken.create({
			data: {
				token: randomBytes(32).toString("hex"),
				userId: userFromEmail.id,
			},
		});

		const link = `${process.env.BASE_URL}/user/reset-password-confirmation/${passwordResetToken.token}`;
		try {
			await sendResetPasswordEmail(userFromEmail.email, link);
		} catch (err) {
			return res.status(400).json({
				message: `Error sending Email`,
			});
		}

		res.sendStatus(200);
	}
);

routerUsers.get(
	"/reset-password-confirmation/:token",
	async function (req: Request, res: Response, next: NextFunction) {
		const resetConfirmPostUrl = `${pathUsers}/reset-password-confirmation/${req.params["token"]}`;
		return res.render("resetPasswordConfirmation", { resetConfirmPostUrl });
	}
);

routerUsers.post(
	"/reset-password-confirmation/:token",
	bodyValidator("PasswordResetConfirmationBody"),
	async function (req: Request, res: Response, next: NextFunction) {
		const body: PasswordResetConfirmationBody = req.body;
		console.log("gboDebug:[body]", body);
		const matchingToken = await prisma.passwordResetToken.findFirst({
			where: {
				token: req.params.token,
			},
			select: {
				id: true,
				user: {
					select: {
						id: true,
						email: true,
						passwordHash: true,
					},
				},
			},
		});
		if (!matchingToken) {
			return res.render("errorPage", {
				errorMessage: `No previous reset password demand was found.`,
			});
		}

		//TODO delete token, authenticate, redirect netflix
		await prisma.user.update({
			data: {
				passwordHash: await hashPassword(body.password),
			},
			where: {
				id: matchingToken.user.id,
			},
		});
		await prisma.passwordResetToken.deleteMany({
			where: {
				userId: matchingToken.user.id,
			},
		});
		res.status(200).send(
			"Password changed. You can use it in the plugin on A movie netflix page."
		);
	}
);

export { routerUsers, pathUsers, passport };
