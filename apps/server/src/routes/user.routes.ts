import { Router } from "express";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { User } from "../entities/User.entity.ts";
import { createUser } from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter.route("/").post(createUser);

export default userRouter;
