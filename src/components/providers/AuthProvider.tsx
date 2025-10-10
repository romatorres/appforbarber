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
    let isMounted = true;

    // Função para atualizar a sessão no store
    const updateSession = async () => {
      try {
        // 1. Se temos sessão inicial do servidor, use ela IMEDIATAMENTE para evitar delay
        if (initialSession && isMounted) {
          const adaptedSession = adaptBetterAuthSession(initialSession);
          if (adaptedSession) {
            setSession(adaptedSession);
          }
        }

        // 2. Depois, sincronize com o cliente em background (sem bloquear UI)
        const { data: clientSession } = await authClient.getSession();

        if (!isMounted) return; // Componente foi desmontado

        const adaptedClientSession = adaptBetterAuthSession(clientSession);

        // Só atualize se os dados do cliente forem diferentes ou se não tínhamos sessão inicial
        if (adaptedClientSession) {
          setSession(adaptedClientSession);
        } else if (!initialSession) {
          // Só limpe se não havia sessão inicial
          setSession(null);
        }
      } catch (error) {
        console.error("Erro ao sincronizar sessão:", error);

        if (!isMounted) return;

        // Em caso de erro, mantenha a sessão inicial se existir
        if (initialSession) {
          const adaptedSession = adaptBetterAuthSession(initialSession);
          if (adaptedSession) {
            setSession(adaptedSession);
          }
        } else {
          setSession(null);
        }
      }
    };

    // Atualizar sessão imediatamente
    updateSession();

    // Escutar eventos de foco da janela para re-sincronizar (com debounce)
    let focusTimeout: NodeJS.Timeout;
    const handleFocus = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        if (isMounted) updateSession();
      }, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isMounted) {
        clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
          if (isMounted) updateSession();
        }, 100);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearTimeout(focusTimeout);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [initialSession, setSession]);

  return <>{children}</>;
}
