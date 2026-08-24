import { create } from 'zustand';

import { clearAccessToken, getAccessToken } from '@/lib/apiClient';
import { clearSession, loadSession, saveSession } from '@/src/services/auth/session';
import type { AuthRole } from '@/src/types/auth';

export type SessionUser = {
  id: string;
  name: string;
  initials: string;
};

type SessionStore = {
  roles: AuthRole[];
  activeRole: AuthRole | null;
  user: SessionUser | null;
  /** True while checking for a persisted session on app launch. */
  isLoading: boolean;
  setRoles: (roles: AuthRole[]) => void;
  setActiveRole: (role: AuthRole) => void;
  setUser: (user: SessionUser | null) => void;
  /** Restore roles/activeRole/user from storage on app launch. */
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
};

function persist(state: Pick<SessionStore, 'roles' | 'activeRole' | 'user'>) {
  if (!state.user || state.roles.length === 0) return;
  void saveSession({ roles: state.roles, activeRole: state.activeRole, user: state.user });
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  roles: [],
  activeRole: null,
  user: null,
  isLoading: true,

  setRoles: (roles) => {
    set({ roles });
    persist(get());
  },
  setActiveRole: (activeRole) => {
    set({ activeRole });
    persist(get());
  },
  setUser: (user) => {
    set({ user });
    persist(get());
  },

  restoreSession: async () => {
    try {
      const token = await getAccessToken();
      const stored = token ? await loadSession() : null;
      if (!stored) {
        set({ isLoading: false });
        return;
      }
      set({
        roles: stored.roles,
        activeRole: stored.activeRole,
        user: stored.user,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await Promise.all([clearAccessToken(), clearSession()]);
    set({ roles: [], activeRole: null, user: null });
  },
}));

// Safety net: if isLoading is still true after 5 seconds (SecureStore hang, etc.),
// force it false so the app doesn't get stuck on the loading screen forever.
setTimeout(() => {
  if (useSessionStore.getState().isLoading) {
    useSessionStore.setState({ isLoading: false });
  }
}, 5000);
