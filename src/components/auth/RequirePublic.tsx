'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { routes } from '@/lib/routes/routes';
import { useAuthStore } from '@/features/auth/auth.store';

export function RequirePublic({ children }: PropsWithChildren) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const hasSession = useAuthStore((state) => Boolean(state.user && state.accessToken));

  useEffect(() => {
    if (hydrated && status === 'authenticated' && hasSession) {
      router.replace(routes.dashboard);
    }
  }, [hasSession, hydrated, router, status]);

  if (!hydrated || status === 'loading') {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 420, width: '100%' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Checking admin session
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                We are checking whether you already signed in.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (hasSession) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 420, width: '100%' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Redirecting to dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                You already have an active admin session.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return children;
}
