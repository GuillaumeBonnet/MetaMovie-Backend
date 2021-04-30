import {
	card,
	deck,
	FindManycardArgs,
	Prisma,
	PrismaClientKnownRequestError,
	user,
} from "@prisma/client";
import express from "express";
import { NextFunction, Request, Response } from "express";
import logger from "morgan";
import prisma from "../prisma-instance";
import { deckToApiFormat, getIdFromUrl } from "./decksUtils";
import {
	CardApi,
	DeckApi,
	CreateFields,
	DeckApi_WithoutCards,
	DeckApi_Createable,
	CardApi_Createable,
	SignupBody,
	UserInfo,
} from "../type";
import { bodyValidator } from "./bodyValidator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { send } from "process";
import { fetchUser, isUserLogged } from "./userUtils";
const routerUsers = express.Router();
const pathUsers = "/users";

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async function (email, password, done) {
			console.log("gboDebug:[email]", email);
			console.log("gboDebug:[password]", password);
			try {
				const userInDb = await prisma.user.findUnique({
					where: { email: email },
				});
				if (!userInDb) {
					return done(null, false, { message: "User not found" });
				}
				if (userInDb.passwordHash != password) {
					return done(null, false, { message: "Wrong password" });
				} else {
					return done(null, userInDb);
				}
			} catch (err) {
				return done(err);
			}
		}
	)
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
					passwordHash: body.password,
					salt: "anything",
				},
			});
		} catch (error) {
			// 'P2002' Unique constraint failed on the {constraint}
			if (error.code == "P2002") {
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
		const userInfo = await fetchUser(req.session?.userId);
		return res.send(userInfo);
	} catch (err) {
		return next(err);
	}
});
routerUsers.post("/login", async function (req, res, next) {
	if (isUserLogged(req)) {
		try {
			const userInfo = await fetchUser(req.session?.userId);
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
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			console.log("gboDebug:[user]", user);
			req.session = {
				userId: user.id,
			};
			const userInfo: UserInfo = {
				username: user.username,
			};
			return res.send(userInfo);
		});
	})(req, res, next);
});

routerUsers.get("/logout", function (req, res) {
	// req.logout();
	req.session = null;
	res.sendStatus(200);
});

export { routerUsers, pathUsers, passport };
