'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { getCurrentUser } from '@/features/auth/auth.api';
import { useAuthStore } from '@/features/auth/auth.store';
import { clearStoredAccessToken, readStoredAccessToken } from '@/features/auth/auth.storage';

export function AuthProvider({ children }: PropsWithChildren) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const setStatus = useAuthStore((state) => state.setStatus);
  const setError = useAuthStore((state) => state.setError);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const storedAccessToken = readStoredAccessToken();

      if (!storedAccessToken) {
        clearSession();
        setHydrated(true);
        return;
      }

      setStatus('loading');

      try {
        const user = await getCurrentUser();

        if (!active) {
          return;
        }

        setSession({ accessToken: storedAccessToken, user });
        setError(null);
      } catch {
        if (!active) {
          return;
        }

        clearStoredAccessToken();
        clearSession();
        setError(null);
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [clearSession, setError, setHydrated, setSession, setStatus]);

  return children;
}
