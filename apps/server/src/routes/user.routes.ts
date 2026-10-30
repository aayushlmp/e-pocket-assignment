import { Router } from "express";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { User } from "../entities/User.entity.ts";
import { createUser, getAllUsers } from "../controllers/user.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const userRouter = Router();

userRouter.route("/").get(verifyJWT, getAllUsers).post(createUser);

export default userRouter;
