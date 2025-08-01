import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import expressSession from "express-session"
import "./app/config/passport"
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cookieParser())
app.use(expressSession({
  secret: "strong secret", // Replace with a strong secret
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Digital Wallet System Management.");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
