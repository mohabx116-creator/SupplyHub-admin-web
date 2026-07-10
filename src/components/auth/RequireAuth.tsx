'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { routes } from '@/lib/routes/routes';
import { useAuthStore } from '@/features/auth/auth.store';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

export function RequireAuth({ children }: PropsWithChildren) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const hasSession = useAuthStore((state) => Boolean(state.user && state.accessToken));

  useEffect(() => {
    if (hydrated && status === 'anonymous') {
      router.replace(routes.login);
    }
  }, [hydrated, router, status]);

  if (!hydrated || status === 'loading') {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 420, width: '100%' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {copy.auth.loadingSession}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {copy.auth.verifyingAccess}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!hasSession) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 420, width: '100%' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {copy.auth.redirectingLogin}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {copy.auth.reservedAuthenticated}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return children;
}
