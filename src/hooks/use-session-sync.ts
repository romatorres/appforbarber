"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/session-store";
import { adaptBetterAuthSession } from "@/lib/session-adapter";

/**
 * Hook para sincronizar a sessão do better-auth com o Zustand store
 * Deve ser usado no layout ou componente raiz do lado cliente
 */
export function useSessionSync() {
    const setSession = useSessionStore((state) => state.setSession);

    useEffect(() => {
        // Função para atualizar a sessão no store
        const updateSession = async () => {
            try {
                const { data: session } = await authClient.getSession();
                const adaptedSession = adaptBetterAuthSession(session);
                setSession(adaptedSession);
            } catch (error) {
                console.error("Erro ao sincronizar sessão:", error);
                setSession(null);
            }
        };

        // Atualizar sessão imediatamente
        updateSession();

        // Escutar eventos de foco da janela para re-sincronizar
        const handleFocus = () => updateSession();
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [setSession]);
}