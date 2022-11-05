import { join, dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";

import AppError from "./utils/AppError.js";
import globalHandlerError from "./controllers/globalHandlerError.js";
//import userRouter from "./routes/userRouter.js";

//APPLICATION EXPRESS
const app = express();

//MIDDLEWARES
app.use(cookieParser());
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(join(__dirname, "public")));

//ROUTES

//app.use('/api/v1/user', userRouter)

app.get("/", (req, res) => {
  res.render("register");
});

app.all("*", (req, res, next) => {
  next(
    new AppError(`Sorry this route ${req.originalUrl} doesnt not exist`, 404)
  );
});

//HANDLER ERROR
app.use(globalHandlerError);

//EXPORT APPLICATION
export default app;
