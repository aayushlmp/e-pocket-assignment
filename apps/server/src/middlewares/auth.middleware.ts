import { AppDataSource } from "../db/index.ts";
import { User } from "../entities/User.entity.ts";
import { ApiError } from "../utils/api-error.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import jwt from "jsonwebtoken";
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

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user: User | null = await userRepository.findOneBy({
        id: decodedToken.id,
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
