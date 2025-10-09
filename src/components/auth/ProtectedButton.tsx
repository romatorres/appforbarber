"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "./PermissionGuard";
import { RoleGuard } from "./RoleGuard";
import { Permission } from "@/lib/permissions";
import { Role } from "@/generated/prisma";

interface ProtectedButtonProps extends React.ComponentProps<typeof Button> {
  permission?: Permission;
  permissions?: Permission[];
  roles?: Role | Role[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ProtectedButton = ({
  permission,
  permissions,
  roles,
  requireAll = false,
  fallback = null,
  children,
  ...buttonProps
}: ProtectedButtonProps) => {
  if (roles) {
    return (
      <RoleGuard roles={roles} fallback={fallback}>
        <Button {...buttonProps}>{children}</Button>
      </RoleGuard>
    );
  }

  if (permission || permissions) {
    return (
      <PermissionGuard
        permission={permission}
        permissions={permissions}
        requireAll={requireAll}
        fallback={fallback}
      >
        <Button {...buttonProps}>{children}</Button>
      </PermissionGuard>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
};
