import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/api-error.ts";

export const errorMiddleware: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: err instanceof ApiError ? err.message : "Internal server error",
  });
};
