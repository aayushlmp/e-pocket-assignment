import { Response } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import { AppDataSource } from "../db/index.ts";
import { User } from "../entities/User.entity.ts";
import { AuthService } from "../services/auth.service.ts";
import { ApiError } from "../utils/api-error.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { AuthenticatedRequest } from "../interfaces/token.interface.ts";

// Instantiate Service layer manually with the User repository instance
const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);

const signIn = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    const loggedInUser = await authService.signIn(email, password);
    const { accessToken, refreshToken } = loggedInUser;
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in prod, false in local dev over http
        sameSite: 'strict' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000 // Example: 7 days expiration line
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, loggedInUser, "Login successful."));
  }
);
const signOut = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req?.user?.id;

      if (id) {
        await authService.signOut(id as string);
        return res
            .status(200)
            .json(
              new ApiResponse(200, undefined, "Logout Successfully")
            );
      }
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid access token";
      throw new ApiError(401, (errorMessage || "Invalid access token"));
    }
  }
);

export { signIn, signOut };
