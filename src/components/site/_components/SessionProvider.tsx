"use client";

import { useEffect } from "react";
import { useSessionStore, Session } from "@/store/session-store";
import { adaptBetterAuthSession } from "@/lib/session-adapter";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    const adaptedSession = adaptBetterAuthSession(session);
    setSession(adaptedSession);
  }, [session, setSession]);

  return <>{children}</>;
}
