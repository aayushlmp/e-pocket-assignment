import { Response, NextFunction } from "express";
import { UserRole } from "@e-pocket-assignment/shared/enums";
import { ApiError } from "../utils/api-error.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { AuthenticatedRequest } from "../interfaces/token.interface.ts";
import {
  getPermissions,
  checkPermission,
  HttpMethod,
} from "../config/permissions.ts";

export const requirePermissions = asyncHandler(
  async (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new ApiError(401, "Unauthorized: User role not found");
    }

    const method = req.method as HttpMethod;
    const path = req.path;

    const pathPermissions = getPermissions(path);

    let hasPermission = false;

    for (const permission of pathPermissions) {
      const methods = Array.isArray(permission.method)
        ? permission.method
        : [permission.method];
      if (
        methods.includes(method) &&
        permission.roles.includes(user.role as UserRole)
      ) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission) {
      const rolePermissions = checkPermission(method, user.role as UserRole);
      if (!rolePermissions) {
        throw new ApiError(
          403,
          `Forbidden: ${user.role} role cannot ${method} this resource`
        );
      }
    }

    next();
  }
);

export default requirePermissions;
