import { NextFunction, Request, Response } from "express";

import express from "express";
var routerIndex = express.Router();

/* GET home page. */
routerIndex.get(
  "/",
  function (req: Request, res: Response, next: NextFunction) {
    res.render("index", { title: "Express" });
  }
);

export { routerIndex };
