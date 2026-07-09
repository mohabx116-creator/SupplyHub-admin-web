import { create } from 'zustand';
import type { AuthSession } from './auth.types';

type AuthState = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

// Phase 17.0 keeps tokens in-memory only; persistence and real auth wiring arrive later.
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
