import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Permission,
  roleHasPermission,
  roleHasAnyPermission,
  roleHasAllPermissions,
} from "@e-pocket-assignment/shared/constants";
import { UserRole } from "@e-pocket-assignment/shared/enums";

export interface UsePermissionReturn {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

/**
 * Reusable permission hook that integrates with AuthContext.
 * Derives permissions from the authenticated user's role using
 * the shared ROLE_PERMISSIONS mapping (single source of truth).
 */
export const usePermission = (): UsePermissionReturn => {
  const { user, isAuthenticated } = useAuth();

  const currentRole = user?.role as UserRole | undefined;

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!isAuthenticated || !currentRole) return false;
      return roleHasPermission(currentRole, permission);
    },
    [isAuthenticated, currentRole],
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!isAuthenticated || !currentRole) return false;
      if (permissions.length === 0) return false;
      return roleHasAnyPermission(currentRole, permissions);
    },
    [isAuthenticated, currentRole],
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!isAuthenticated || !currentRole) return false;
      if (permissions.length === 0) return false;
      return roleHasAllPermissions(currentRole, permissions);
    },
    [isAuthenticated, currentRole],
  );

  return useMemo(
    () => ({ hasPermission, hasAnyPermission, hasAllPermissions }),
    [hasPermission, hasAnyPermission, hasAllPermissions],
  );
};

export default usePermission;
