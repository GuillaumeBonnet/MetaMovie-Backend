import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { routerIndex } from "./routes/index";
import { routerDecks } from "./routes/decks";
import { deck } from "../node_modules/.prisma/client/index";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routerIndex);
app.use("/decks", routerDecks);

export { app };
