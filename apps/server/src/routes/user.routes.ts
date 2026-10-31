import { Router } from "express";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { User } from "../entities/User.entity.ts";
import { createUser, getAllUsers } from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(validateReqPayload(User), createUser);

export default userRouter;
