import { useSessionStore } from "@/store/session-store";
import { Role } from "@/generated/prisma";
import { useCallback } from "react";

export const useAuth = () => {
  // Usar seletores separados para evitar problemas de shallow
  const session = useSessionStore((state) => state.session);
  const status = useSessionStore((state) => state.status);

  const user = session?.user;

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
    [user],
  );

  return {
    user,
    session,
    status,
    hasRole,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
