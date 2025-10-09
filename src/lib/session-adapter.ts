import { Session } from "@/store/session-store";

/**
 * Converte a sessão do better-auth para o formato do Zustand store
 */
export function adaptBetterAuthSession(betterAuthSession: any): Session {
    if (!betterAuthSession || !betterAuthSession.user) {
        return null;
    }

    return {
        user: {
            id: betterAuthSession.user.id,
            name: betterAuthSession.user.name,
            email: betterAuthSession.user.email,
            image: betterAuthSession.user.image,
            role: betterAuthSession.user.role || "USER",
            companyId: betterAuthSession.user.companyId || null,
        },
        expires:
            betterAuthSession.expiresAt ||
            betterAuthSession.expires ||
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
}