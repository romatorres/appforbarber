import { Role } from "@/generated/prisma";

/**
 * Mapeamento das roles do sistema para português
 */
export const ROLE_TRANSLATIONS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super Admin",
  [Role.ADMIN]: "Admin",
  [Role.EMPLOYEE]: "Funcionário",
  [Role.USER]: "Cliente",
} as const;

/**
 * Traduz uma role do inglês para português
 * @param role - Role em inglês
 * @returns Role traduzida para português
 */
export function translateRole(role: Role): string {
  return ROLE_TRANSLATIONS[role] || role;
}

/**
 * Obtém todas as roles traduzidas como array de objetos
 * @returns Array com value (inglês) e label (português)
 */
export function getRoleOptions() {
  return Object.entries(ROLE_TRANSLATIONS).map(([value, label]) => ({
    value: value as Role,
    label,
  }));
}
