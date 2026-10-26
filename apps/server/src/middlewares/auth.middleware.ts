import { AppDataSource } from "../db/index.ts";
import { User } from "../entities/User.entity.ts";
import { ApiError } from "../utils/api-error.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/token.interface.ts";

const userRepository = AppDataSource.getRepository(User);

export const verifyJWT = asyncHandler(
  async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;

      if (!secret) {
        // Configuration problem, not an authentication failure.
        throw new Error("ACCESS_TOKEN_SECRET is not configured");
      }

      const decodedToken = jwt.verify(token, secret);

      const user: User | null = await userRepository.findOneBy({
        id: (decodedToken as JwtPayload).id,
      });

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid access token";
      throw new ApiError(401, errorMessage || "Invalid access token");
    }
  }
);
