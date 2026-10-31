import { UserRole } from "@e-pocket-assignment/shared/enums";
import {
  Permission,
  ROLE_PERMISSIONS as SHARED_ROLE_PERMISSIONS,
  roleHasPermission,
} from "@e-pocket-assignment/shared/constants";

export type HttpMethod =
  "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface RoutePermission {
  method: HttpMethod | HttpMethod[];
  roles: UserRole[];
  /** Optional: specific path patterns this applies to */
  paths?: string[];
}

/**
 * Maps Permission constants to HTTP methods for route-level authorization.
 * This bridges the gap between action-based permissions (frontend) and
 * HTTP method-based permissions (backend middleware).
 */
export const PERMISSION_TO_METHODS: Record<Permission, HttpMethod[]> = {
  [Permission.USER_VIEW]: ["GET"],
  [Permission.USER_CREATE]: ["POST"],
  [Permission.USER_UPDATE]: ["PUT", "PATCH"],
  [Permission.USER_DELETE]: ["DELETE"],
  [Permission.USER_CHANGE_STATUS]: ["PATCH", "PUT"],
  [Permission.TRANSACTION_VIEW]: ["GET"],
  [Permission.TRANSACTION_CREATE]: ["POST"],
  [Permission.TRANSACTION_UPDATE]: ["PUT", "PATCH"],
  [Permission.TRANSACTION_DELETE]: ["DELETE"],
  [Permission.TRANSACTION_ADD_NOTE]: ["POST"],
};

/**
 * Re-export shared role permissions for backend use.
 * Uses the shared package as single source of truth.
 */
export const ROLE_PERMISSIONS = SHARED_ROLE_PERMISSIONS;

export const DEFAULT_PERMISSIONS: RoutePermission[] = [
  {
    method: ["GET", "HEAD", "OPTIONS"],
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
  },
  {
    method: ["POST", "PUT", "PATCH"],
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    method: ["DELETE"],
    roles: [UserRole.SUPER_ADMIN],
  },
];

export const PATH_PERMISSIONS: Record<string, RoutePermission[]> = {
  "/auth/**": [
    {
      method: ["POST"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
    },
  ],
  "/users/**": [
    {
      method: ["GET"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
    },
    {
      method: ["POST", "PUT", "PATCH"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    { method: ["DELETE"], roles: [UserRole.SUPER_ADMIN] },
  ],
  "/transactions/**": [
    {
      method: ["GET"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER],
    },
    {
      method: ["POST", "PUT", "PATCH"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    { method: ["DELETE"], roles: [UserRole.SUPER_ADMIN] },
  ],
  "/admin/**": [
    {
      method: ["GET", "POST", "PUT", "PATCH"],
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    { method: ["DELETE"], roles: [UserRole.SUPER_ADMIN] },
  ],
};

export function getAllowedMethods(role: UserRole): HttpMethod[] {
  // Derive from shared permissions
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  const methods = new Set<HttpMethod>();
  for (const perm of permissions) {
    PERMISSION_TO_METHODS[perm]?.forEach((m) => methods.add(m));
  }
  return Array.from(methods);
}

export function checkPermission(method: HttpMethod, role: UserRole): boolean {
  const allowed = getAllowedMethods(role);
  return allowed.includes(method);
}

export function matchPath(pattern: string, path: string): boolean {
  const regexPattern = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
  return new RegExp(`^${regexPattern}$`).test(path);
}

export function getPermissions(path: string): RoutePermission[] {
  for (const [pattern, permissions] of Object.entries(PATH_PERMISSIONS)) {
    if (matchPath(pattern, path)) {
      return permissions;
    }
  }
  return DEFAULT_PERMISSIONS;
}

/**
 * Creates a middleware that checks for a specific Permission constant.
 * Usage: router.delete("/:id", authenticate, requirePermission(Permission.USER_DELETE), handler)
 */
export function requirePermission(permission: Permission) {
  return (req: any, _res: any, next: any) => {
    const user = req.user;
    const method = req.method as HttpMethod;

    if (!user || !user.role) {
      const error = new Error("Unauthorized: User role not found");
      (error as any).statusCode = 401;
      throw error;
    }

    // Check if user's role has this permission
    if (!roleHasPermission(user.role as UserRole, permission)) {
      const error = new Error(
        `Forbidden: ${user.role} role cannot ${permission.replace(/_/g, " ").toLowerCase()}`
      );
      (error as any).statusCode = 403;
      throw error;
    }

    // Also verify the HTTP method matches the permission
    const allowedMethods = PERMISSION_TO_METHODS[permission];
    if (allowedMethods && !allowedMethods.includes(method)) {
      const error = new Error(
        `Forbidden: ${permission} requires ${allowedMethods.join("/")} method`
      );
      (error as any).statusCode = 403;
      throw error;
    }

    next();
  };
}

export {
  Permission,
  roleHasPermission,
  roleHasAnyPermission,
  roleHasAllPermissions,
  getPermissionsForRole,
} from "@e-pocket-assignment/shared/constants";
