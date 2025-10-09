"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/session-store";
import { adaptBetterAuthSession } from "@/lib/session-adapter";
import { authClient } from "@/lib/auth-client";

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: unknown; // Sessão inicial do servidor (opcional)
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    // Função para atualizar a sessão no store
    const updateSession = async () => {
      try {
        // Se temos sessão inicial do servidor, use ela primeiro
        if (initialSession) {
          const adaptedSession = adaptBetterAuthSession(initialSession);
          setSession(adaptedSession);
        }

        // Sempre sincronizar com o cliente para garantir dados atualizados
        const { data: clientSession } = await authClient.getSession();
        const adaptedClientSession = adaptBetterAuthSession(clientSession);
        setSession(adaptedClientSession);
      } catch (error) {
        console.error("Erro ao sincronizar sessão:", error);
        setSession(null);
      }
    };

    // Atualizar sessão imediatamente
    updateSession();

    // Escutar eventos de foco da janela para re-sincronizar
    const handleFocus = () => updateSession();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [initialSession, setSession]);

  return <>{children}</>;
}
