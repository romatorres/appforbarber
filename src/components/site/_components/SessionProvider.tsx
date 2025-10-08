"use client";

import { useRef } from "react";
import { useSessionStore, Session } from "@/store/session-store";

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  const setSession = useSessionStore((state) => state.setSession);
  const initialized = useRef(false);

  // Usamos um ref para garantir que o store seja inicializado apenas uma vez
  if (!initialized.current) {
    setSession(session);
    initialized.current = true;
  }

  return <>{children}</>;
}
