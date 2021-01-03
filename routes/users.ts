import express from "express";
var router = express.Router();
import { NextFunction, Request, Response } from "express";

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resourcee");
});

module.exports = router;
