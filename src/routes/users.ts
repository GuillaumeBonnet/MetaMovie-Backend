import express from "express";
var routerUsers = express.Router();
import { NextFunction, Request, Response } from "express";

/* GET users listing. */
routerUsers.get(
  "/",
  function (req: Request, res: Response, next: NextFunction) {
    res.send("respond with a resourcee");
  }
);

export { routerUsers };
