import type { ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import { Permission } from "@e-pocket-assignment/shared/constants";

export interface CanProps {
  /** Single permission to check */
  permission?: Permission;
  /** Multiple permissions - when requireAll is false, checks ANY; when true, checks ALL */
  permissions?: Permission[];
  /** If true, requires ALL permissions in the array (only applies when permissions array is used) */
  requireAll?: boolean;
  /** Content to render when access is granted */
  children: ReactNode;
  /** Optional fallback when access is denied */
  fallback?: ReactNode;
}

/**
 * Conditional rendering component for permission-based authorization.
 * Similar to Angular structural directive *ngIf / *appHasPermission.
 */
export const Can = ({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: CanProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  // Determine if access is granted
  let accessGranted = false;

  if (permission && !permissions) {
    accessGranted = hasPermission(permission);
  } else if (permissions && !permission) {
    if (requireAll) {
      accessGranted = hasAllPermissions(permissions);
    } else {
      accessGranted = hasAnyPermission(permissions);
    }
  } else if (permission && permissions) {
    // Both provided - treat as requiring all including single
    const combined = [permission, ...permissions];
    accessGranted = hasAllPermissions(combined);
  }

  if (!accessGranted) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default Can;