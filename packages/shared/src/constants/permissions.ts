import { UserRole } from "../enums/index.js";

/**
 * Centralized permission definitions.
 * Single source of truth for both frontend and backend.
 */
export const Permission = {
  // User permissions
  USER_VIEW: "USER_VIEW",
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  USER_DELETE: "USER_DELETE",
  USER_CHANGE_STATUS: "USER_CHANGE_STATUS",

  // Transaction permissions
  TRANSACTION_VIEW: "TRANSACTION_VIEW",
  TRANSACTION_CREATE: "TRANSACTION_CREATE",
  TRANSACTION_UPDATE: "TRANSACTION_UPDATE",
  TRANSACTION_DELETE: "TRANSACTION_DELETE",
  TRANSACTION_ADD_NOTE: "TRANSACTION_ADD_NOTE",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

/**
 * Role-to-permission mapping.
 * Defines which permissions each role has.
 * This is the single source of truth for authorization rules.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_CHANGE_STATUS,
    Permission.TRANSACTION_VIEW,
    Permission.TRANSACTION_CREATE,
    Permission.TRANSACTION_UPDATE,
    Permission.TRANSACTION_ADD_NOTE,
    Permission.TRANSACTION_DELETE,
  ],
  [UserRole.ADMIN]: [
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.TRANSACTION_VIEW,
    Permission.TRANSACTION_CREATE,
    Permission.TRANSACTION_UPDATE,
    Permission.TRANSACTION_ADD_NOTE,
  ],
  [UserRole.USER]: [Permission.TRANSACTION_VIEW],
};

/**
 * Checks if a role has a specific permission.
 */
export function roleHasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Checks if a role has any of the specified permissions.
 */
export function roleHasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  if (permissions.length === 0) return false;
  return permissions.some((p) => roleHasPermission(role, p));
}

/**
 * Checks if a role has all of the specified permissions.
 */
export function roleHasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  if (permissions.length === 0) return false;
  return permissions.every((p) => roleHasPermission(role, p));
}

/**
 * Gets all permissions for a role.
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
