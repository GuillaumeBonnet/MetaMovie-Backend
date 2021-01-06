import express from "express";
var routerUsers = express.Router();
import { NextFunction, Request, Response } from "express";
import { tmp } from "./tmp";

/* GET users listing. */
routerUsers.get(
	"/",
	function (req: Request, res: Response, next: NextFunction) {
		tmp.get("aString");
		res.send("respond with a resourcee");
	}
);

export { routerUsers };
