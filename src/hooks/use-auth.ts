import { useSessionStore } from "@/store/session-store";
import { Role } from "@/generated/prisma";
import { useCallback, useMemo } from "react";
import { translateRole } from "@/lib/role-translations";

export const useAuth = () => {
  // Usar seletores otimizados para evitar re-renders desnecessários
  const session = useSessionStore((state) => state.session);
  const status = useSessionStore((state) => state.status);

  const user = session?.user;

  // Role traduzida para português
  const userRoleTranslated = useMemo(() => {
    return user?.role ? translateRole(user.role) : null;
  }, [user?.role]);

  /**
   * Verifica se o usuário logado possui uma das roles permitidas.
   * @param allowedRoles - Um array de roles ou uma única role a ser verificada.
   * @returns `true` se o usuário tiver a permissão, `false` caso contrário.
   */
  const hasRole = useCallback(
    (allowedRoles: Role | Role[]): boolean => {
      if (!user || !user.role) {
        return false;
      }

      const rolesToCheck = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];
      return rolesToCheck.includes(user.role);
    },
    [user]
  );

  return {
    user,
    session,
    status,
    hasRole,
    userRole: user?.role,
    userRoleTranslated,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
