import { useMemo } from "react";
import { useAuth } from "./use-auth";
import { ROLE_PERMISSIONS, Permission } from "@/lib/permissions";

export const usePermissions = () => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user?.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const canAccessCompany = (companyId?: string | null): boolean => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    return user.companyId === companyId;
  };

  const canAccessBranch = (
    branchId?: string | null,
    companyId?: string | null
  ): boolean => {
    if (!canAccessCompany(companyId)) return false;
    // Lógica adicional para verificar acesso à filial específica pode ser adicionada aqui
    return true;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessCompany,
    canAccessBranch,
    permissions: userPermissions,
  };
};
