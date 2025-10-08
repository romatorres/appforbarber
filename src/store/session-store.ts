import { create } from 'zustand';
import { Role } from '@/generated/prisma';

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
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: 'loading', // Começa como 'loading' até a sessão ser verificada
  setSession: (session) => {
    set({
      session,
      status: session ? 'authenticated' : 'unauthenticated',
    });
  },
}));
