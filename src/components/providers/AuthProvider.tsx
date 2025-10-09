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
        // Sempre buscar do cliente primeiro (mais confiável)
        const { data: clientSession } = await authClient.getSession();
        const adaptedClientSession = adaptBetterAuthSession(clientSession);

        // Se conseguiu dados do cliente, use eles
        if (adaptedClientSession) {
          setSession(adaptedClientSession);
          return;
        }

        // Se não tem dados do cliente, tente a sessão inicial do servidor
        if (initialSession) {
          const adaptedSession = adaptBetterAuthSession(initialSession);
          setSession(adaptedSession);
          return;
        }

        // Se não tem nenhuma sessão válida, limpe o store
        setSession(null);
      } catch (error) {
        console.error("Erro ao sincronizar sessão:", error);

        // Em caso de erro, tente usar a sessão inicial como fallback
        if (initialSession) {
          const adaptedSession = adaptBetterAuthSession(initialSession);
          setSession(adaptedSession);
        } else {
          setSession(null);
        }
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
