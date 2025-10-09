import { Session } from "@/store/session-store";
import { Role } from "@/generated/prisma";

/**
 * Estrutura esperada da sessão do BetterAuth
 */
interface BetterAuthSession {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: Role;
    companyId?: string | null;
  };
  expiresAt?: string;
  expires?: string;
}

/**
 * Converte a sessão do better-auth para o formato do Zustand store
 * @param betterAuthSession - Sessão do BetterAuth (pode ser unknown)
 * @returns Session formatada para o store ou null se inválida
 */
export function adaptBetterAuthSession(betterAuthSession: unknown): Session {
  // Verificar se a sessão existe e tem a estrutura esperada
  if (!betterAuthSession || typeof betterAuthSession !== "object") {
    return null;
  }

  const session = betterAuthSession as BetterAuthSession;

  // Verificar se tem usuário - apenas ID é obrigatório
  if (!session.user?.id) {
    return null;
  }

  // Calcular data de expiração (padrão: 24 horas)
  const defaultExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();
  const expires = session.expiresAt || session.expires || defaultExpires;

  return {
    user: {
      id: session.user.id,
      name: session.user.name || "Usuário", // Fallback se name não existir
      email: session.user.email || "", // Fallback se email não existir
      image: session.user.image || null,
      role: session.user.role || Role.USER,
      companyId: session.user.companyId || null,
    },
    expires,
  };
}
