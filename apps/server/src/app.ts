import express, { type Express } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_ROUTES } from '@e-pocket-assignment/shared/routes';
import healthcheckRouter from "./routes/healthcheck.routes.ts"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(API_ROUTES.HEALTH_CHECK, healthcheckRouter)
// app.use("/api/v1/users", userRouter)
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)

export { app };