import { Router } from "express";
import { signIn, signOut } from "../controllers/auth.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const authRouter = Router();

authRouter.route("/login").post(signIn);
//secured routes
authRouter.route("/logout").post(verifyJWT, signOut);
export default authRouter;
