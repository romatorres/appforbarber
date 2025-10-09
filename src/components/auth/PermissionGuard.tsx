"use client";

import { useMemo } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@/lib/permissions";

interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  const hasAccess = useMemo(() => {
    if (permission) return hasPermission(permission);
    if (permissions.length === 0) return true;
    return requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }, [
    permission,
    permissions,
    requireAll,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  ]);

  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
};
