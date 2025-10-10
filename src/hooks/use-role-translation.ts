import { Role } from "@/generated/prisma";
import { translateRole, getRoleOptions } from "@/lib/role-translations";

/**
 * Hook para tradução de roles
 */
export const useRoleTranslation = () => {
  return {
    /**
     * Traduz uma role para português
     */
    translate: translateRole,

    /**
     * Obtém todas as opções de roles traduzidas
     */
    getRoleOptions,

    /**
     * Traduz múltiplas roles
     */
    translateMultiple: (roles: Role[]) => roles.map(translateRole),
  };
};
