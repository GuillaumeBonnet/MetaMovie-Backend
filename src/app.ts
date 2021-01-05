import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { routerIndex } from "./routes/index";
import { routerUsers } from "./routes/users";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routerIndex);
app.use("/users", routerUsers);
console.log("gboDebug: in app file");

export { app };
