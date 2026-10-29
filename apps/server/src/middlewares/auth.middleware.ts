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
      // 1. Extract token cleanly
      const authHeader = req.header("Authorization");
      const token = authHeader?.replace(/^Bearer\s+/i, "");
      // const token =
      //   req.cookies?.accessToken || authHeader?.replace(/^Bearer\s+/i, "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request: No token provided");
      }

      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        // Log this internally so developers see it, but don't leak details to the client
        console.error(
          "CRITICAL: ACCESS_TOKEN_SECRET is missing from environment variables."
        );
        throw new ApiError(500, "Internal server configuration error");
      }

      // 2. Verify token (Removed invalid await)
      const decodedToken = jwt.verify(token, secret) as JwtPayload;

      if (!decodedToken || !decodedToken.id) {
        throw new ApiError(401, "Invalid Access Token payload");
      }

      // 3. Fetch minimal user data (Use select to optimize database performance)
      const user = await userRepository.findOne({
        where: { id: decodedToken.id },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new ApiError(401, "User no longer exists or token is invalid");
      }

      // 4. Attach to request object
      req.user = user;

      next();
    } catch (error: unknown) {
      console.error("JWT Verification Error:", error);

      // Handle specific JWT expiration errors gracefully
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Access token has expired");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid access token structure");
      }

      // Fallback for existing ApiErrors or unexpected issues
      if (error instanceof ApiError) throw error;

      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      throw new ApiError(401, errorMessage);
    }
  }
);
