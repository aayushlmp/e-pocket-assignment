import { Router } from "express";
import { validateReqPayload } from "../middlewares/validate-payload.middleware.ts";
import { User } from "../entities/User.entity.ts";
import { createUser, getAllUsers } from "../controllers/user.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { requirePermission } from "../config/permissions.ts";
import { Permission } from "@e-pocket-assignment/shared/constants";

const userRouter = Router();

userRouter
  .route("/")
  .get(verifyJWT, requirePermission(Permission.USER_VIEW), getAllUsers)
  .post(validateReqPayload(User), createUser);

export default userRouter;
