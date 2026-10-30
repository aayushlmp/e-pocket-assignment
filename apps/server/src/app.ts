import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_ROUTES } from "@e-pocket-assignment/shared/routes";
import healthcheckRouter from "./routes/healthcheck.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import transactionRouter from "./routes/transaction.routes.ts";

import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { verifyJWT } from "./middlewares/auth.middleware.ts";
import userRouter from "./routes/user.routes.ts";
import graphRouter from "./routes/graph.routes.ts";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(API_ROUTES.HEALTH_CHECK, healthcheckRouter);
app.use(`${API_ROUTES.AUTH}`, authRouter);
app.use(`${API_ROUTES.USERS}`, userRouter);
app.use(`${API_ROUTES.TRANSACTIONS}`, verifyJWT, transactionRouter);
app.use(`${API_ROUTES.TRANSACTIONS_GRAPHS}`, verifyJWT, graphRouter);
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)

app.use(errorMiddleware);

export { app };
