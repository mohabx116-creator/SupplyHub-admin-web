'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { RequirePublic } from '@/components/auth/RequirePublic';
import { login } from '@/features/auth/auth.api';
import { useAuthStore } from '@/features/auth/auth.store';
import { ApiError } from '@/lib/api/api-error';
import { routes } from '@/lib/routes/routes';

export default function LoginPage() {
  return (
    <RequirePublic>
      <LoginForm />
    </RequirePublic>
  );
}

function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const setError = useAuthStore((state) => state.setError);
  const error = useAuthStore((state) => state.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submit = async () => {
      setIsSubmitting(true);
      setError(null);

      try {
        const session = await login({ email, password });
        setSession(session);
        router.replace(routes.dashboard);
      } catch (loginError) {
        if (loginError instanceof ApiError) {
          setError(
            loginError.status === 401
              ? 'Invalid email or password.'
              : loginError.message,
          );
        } else if (loginError instanceof Error) {
          setError(loginError.message);
        } else {
          setError('Unable to sign in right now.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    void submit();
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                SupplyHub Admin
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Sign in to SupplyHub
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Use your admin account to access the dashboard and authenticate
                against the live SupplyHub API.
              </Typography>
            </Box>

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                fullWidth
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                fullWidth
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
