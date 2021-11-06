import { user } from "@prisma/client";
import express from "express";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma-instance";
import {
	SignupBody,
	PasswordResetDemandBody,
	PasswordResetConfirmationBody,
} from "../type";
import { bodyValidator } from "../Services/bodyValidator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
	activateUserIfRight,
	fetchUserInfo,
	hashPassword,
	isUserLogged,
} from "../Utils/userUtils";
import { compare } from "bcrypt";
import { randomBytes, randomInt } from "crypto";
import {
	sendEmailConfirmationEmail,
	sendResetPasswordEmail,
} from "../Services/EmailSender";
import { match } from "assert";
const routerUsers = express.Router();
const pathUsers = "/users";

passport.use(
	new LocalStrategy({ usernameField: "email" }, async function (
		email,
		password,
		done
	) {
		try {
			const userInDb = await prisma.user.findUnique({
				where: { email: email },
			});
			if (!userInDb) {
				return done(null, false, { message: "User not found" });
			}
			if (!(await compare(password, userInDb.passwordHash))) {
				return done(null, false, { message: "Wrong password" });
			}
			if (!userInDb.isActive) {
				return done(null, false, {
					message: "Email not confirmed yet.",
				});
			}
			return done(null, userInDb);
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
		const createUser = async () => {
			try {
				const user = await prisma.user.create({
					data: {
						email: body.email,
						username: body.username,
						passwordHash: await hashPassword(body.password),
						isActive: false,
						confirmEmailUserToken: {
							create: {
								randomNumber: randomInt(0, Math.pow(10, 6)),
								// randomNumber in the [0;999999] interval
							},
						},
					},
					select: {
						confirmEmailUserToken: {
							select: {
								randomNumber: true,
							},
						},
						email: true,
						id: true,
					},
				});
				return user;
			} catch (error: any) {
				// 'P2002' Unique constraint failed on the {constraint}
				if (error?.code == "P2002") {
					if (error?.meta?.target?.includes("email")) {
						throw { message: "Email is already used." };
					} else if (error?.meta?.target?.includes("username")) {
						throw { message: "Username is already used." };
					}
				}
				throw error;
			}
		};

		try {
			const user = await createUser();
			const link = `${process.env.ROOT_URL}${pathUsers}/email-activation/${user.id}/${user.confirmEmailUserToken[0].randomNumber}`;
			await sendEmailConfirmationEmail(user.email, link);
			res.sendStatus(200);
		} catch (error: any) {
			if (error.message) {
				return res.status(404).json({ message: error.message });
			} else {
				return next(error);
			}
		}
	}
);

routerUsers.post(
	"/email-activation/:userId/:validationNumber",
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			await activateUserIfRight(req);
		} catch (error) {
			return res.status(400).json({ message: error });
		}
	}
);
routerUsers.get(
	"/email-activation/:userId/:validationNumber",
	async function (req: Request, res: Response, next: NextFunction) {
		try {
			await activateUserIfRight(req);
		} catch (error) {
			return res.render("errorPage", {
				errorMessage: error,
			});
		}
		return res.render("emailConfirmed", {});
	}
);

routerUsers.get("/info", async function (req, res, next) {
	if (!isUserLogged(req)) {
		res.cookie("meta-movie-test", "testValue");
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
			req.session = null;
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
			console.log("gboDebug:[req.session]", req.session);
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

		// awaiting the email is sent before sending the response won't be good with scalling.
		const passwordResetToken = await prisma.passwordResetToken.create({
			data: {
				token: randomBytes(32).toString("hex"),
				userId: userFromEmail.id,
			},
		});

		const link = `${process.env.ROOT_URL}${pathUsers}/reset-password-confirmation/${passwordResetToken.token}`;
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
				isActive: true,
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
			"Password changed. You can use it in the plugin on a movie netflix page."
		);
	}
);

export { routerUsers, pathUsers, passport };
