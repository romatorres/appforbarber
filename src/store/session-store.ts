import { create } from "zustand";
import { Role } from "@/generated/prisma";

// Estendendo o tipo de usuário para incluir nossas propriedades customizadas
export type UserSession = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  companyId: string | null;
};

export type Session = {
  user: UserSession;
  expires: string;
} | null;

type SessionState = {
  session: Session;
  status: "loading" | "authenticated" | "unauthenticated";
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  status: "loading",
  setSession: (session) => {
    const currentState = get();

    // Evitar re-renders desnecessários se a sessão não mudou
    if (
      currentState.session?.user?.id === session?.user?.id &&
      currentState.status === (session ? "authenticated" : "unauthenticated")
    ) {
      return;
    }

    set({
      session,
      status: session ? "authenticated" : "unauthenticated",
    });
  },
  clearSession: () => {
    set({
      session: null,
      status: "unauthenticated",
    });
  },
}));
