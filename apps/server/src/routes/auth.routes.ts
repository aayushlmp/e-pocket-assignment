import { Router } from "express";
import { signIn, signOut } from "../controllers/auth.controller.ts"
const router = Router();


router.route("/login").post(signIn);

//secured routes
// router.route("/logout").post(verifyJWT,  signOut)
// router.route("/refresh-token").post(refreshAccessToken)
export default router;