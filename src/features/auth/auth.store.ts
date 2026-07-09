import { create } from 'zustand';
import type { AuthSession } from './auth.types';
import {
  clearStoredAccessToken,
  writeStoredAccessToken,
} from './auth.storage';
import type { AuthStatus } from './auth.types';

type AuthState = {
  user: AuthSession['user'] | null;
  accessToken: string | null;
  status: AuthStatus;
  hydrated: boolean;
  error: string | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
  setHydrated: (hydrated: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',
  hydrated: false,
  error: null,
  setSession: (session) => {
    writeStoredAccessToken(session.accessToken);
    set({
      user: session.user,
      accessToken: session.accessToken,
      status: 'authenticated',
      error: null,
    });
  },
  clearSession: () => {
    clearStoredAccessToken();
    set({
      user: null,
      accessToken: null,
      status: 'anonymous',
      error: null,
    });
  },
  setStatus: (status) => set({ status }),
  setHydrated: (hydrated) => set({ hydrated }),
  setError: (error) => set({ error }),
}));
