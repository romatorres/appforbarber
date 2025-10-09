"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { Role } from "@/generated/prisma";
import { Permission } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PageGuardProps {
  roles?: Role | Role[];
  permissions?: Permission | Permission[];
  requireAll?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PageGuard = ({
  roles,
  permissions,
  requireAll = false,
  redirectTo = "/admin",
  fallback = (
    <div className="flex items-center justify-center h-64">Carregando...</div>
  ),
  children,
}: PageGuardProps) => {
  const { hasRole, isAuthenticated, isLoading } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated) {
      let hasAccess = true;

      // Verificar roles se especificadas
      if (roles) {
        hasAccess = hasRole(roles);
      }

      // Verificar permissões se especificadas
      if (hasAccess && permissions) {
        const permsArray = Array.isArray(permissions)
          ? permissions
          : [permissions];
        hasAccess = requireAll
          ? hasAllPermissions(permsArray)
          : hasAnyPermission(permsArray);
      }

      if (!hasAccess) {
        router.push(redirectTo);
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    roles,
    permissions,
    requireAll,
    redirectTo,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    router,
  ]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Verificações finais antes de renderizar
  let hasAccess = true;

  if (roles) {
    hasAccess = hasRole(roles);
  }

  if (hasAccess && permissions) {
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    hasAccess = requireAll
      ? hasAllPermissions(permsArray)
      : hasAnyPermission(permsArray);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
