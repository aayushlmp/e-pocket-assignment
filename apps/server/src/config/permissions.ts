import { UserRole } from "@e-pocket-assignment/shared/enums";

export type HttpMethod =
  "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export interface RoutePermission {
  method: HttpMethod | HttpMethod[];
  roles: UserRole[];
  /** Optional: specific path patterns this applies to */
  paths?: string[];
}

export interface RolePermissions {
  [role: string]: {
    allowedMethods: HttpMethod[];
    forbiddenMethods: HttpMethod[];
    /** Paths this role can access (empty = all) */
    allowedPaths?: string[];
    /** Paths this role cannot access */
    forbiddenPaths?: string[];
  };
}

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.SUPER_ADMIN]: {
    allowedMethods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ],
    forbiddenMethods: [],
  },
  [UserRole.ADMIN]: {
    allowedMethods: ["GET", "POST", "PUT", "PATCH", "HEAD", "OPTIONS"],
    forbiddenMethods: ["DELETE"],
  },
  [UserRole.USER]: {
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    forbiddenMethods: ["POST", "PUT", "PATCH", "DELETE"],
  },
};

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

export function getAllowedActions(role: UserRole): HttpMethod[] {
  return ROLE_PERMISSIONS[role]?.allowedMethods ?? [];
}

export function getDeniedPermissions(role: UserRole): HttpMethod[] {
  return ROLE_PERMISSIONS[role]?.forbiddenMethods ?? [];
}

export function checkPermission(method: HttpMethod, role: UserRole): boolean {
  const allowed = getAllowedActions(role);
  const forbidden = getDeniedPermissions(role);
  return allowed.includes(method) && !forbidden.includes(method);
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
