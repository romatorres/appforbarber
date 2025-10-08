import { useSessionStore } from '@/store/session-store';
import { Role } from '@/generated/prisma';

export const useAuth = () => {
  const {
    session,
    status,
  } = useSessionStore((state) => ({ session: state.session, status: state.status }));

  const user = session?.user;

  /**
   * Verifica se o usuário logado possui uma das roles permitidas.
   * @param allowedRoles - Um array de roles ou uma única role a ser verificada.
   * @returns `true` se o usuário tiver a permissão, `false` caso contrário.
   */
  const hasRole = (allowedRoles: Role | Role[]): boolean => {
    if (!user || !user.role) {
      return false;
    }

    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return rolesToCheck.includes(user.role);
  };

  return {
    user,
    session,
    status,
    hasRole,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
};
