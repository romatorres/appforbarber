"use client";

import { useAuth } from "@/hooks/use-auth";
import { Role } from "@/generated/prisma";

interface RoleGuardProps {
  roles: Role | Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard = ({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) => {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) return <>{fallback}</>;
  return <>{children}</>;
};
