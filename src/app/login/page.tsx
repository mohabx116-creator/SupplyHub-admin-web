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
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
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
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
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
              ? copy.auth.invalidCredentials
              : loginError.message,
          );
        } else if (loginError instanceof Error) {
          setError(loginError.message);
        } else {
          setError(copy.auth.genericError);
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
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#f8fafc',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '40%',
          bgcolor: '#0f172a',
          color: '#ffffff',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack spacing={2} sx={{ zIndex: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                display: 'grid',
                placeItems: 'center',
                background: '#f59e0b',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: '1.3rem',
              }}
            >
              SH
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
              SUPPLYHUB
            </Typography>
          </Stack>

          <Box sx={{ mt: 10 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2, letterSpacing: '-0.02em' }}
            >
              {copy.auth.bannerTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.05rem' }}
            >
              {copy.auth.bannerDescription}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ zIndex: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            {copy.auth.bannerFootnote}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 4 },
          py: 6,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 460,
            borderRadius: 1,
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Stack spacing={4}>
              <Box>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      display: 'grid',
                      placeItems: 'center',
                      background: '#f59e0b',
                      color: '#0f172a',
                      fontWeight: 800,
                    }}
                  >
                    SH
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, letterSpacing: '0.05em', color: '#0f172a' }}
                  >
                    SUPPLYHUB
                  </Typography>
                </Stack>

                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {copy.auth.secureAccess}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mt: 0.5, letterSpacing: '-0.02em', color: '#0f172a' }}
                >
                  {copy.auth.pageTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                {copy.auth.subtitle}
                </Typography>
              </Box>

              <Stack component="form" spacing={3} onSubmit={handleSubmit}>
                <TextField
                  label={copy.auth.emailLabel}
                  type="email"
                  name="email"
                  autoComplete="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0f172a',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f59e0b',
                      },
                    },
                  }}
                />
                <TextField
                  label={copy.auth.passwordLabel}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  fullWidth
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  InputLabelProps={{ sx: { fontWeight: 500 } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0f172a',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f59e0b',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ py: 1.5, fontSize: '0.95rem' }}
                >
                  {isSubmitting ? copy.auth.submitting : copy.auth.submit}
                </Button>
              </Stack>

              {error ? (
                <Alert severity="error" sx={{ borderRadius: 1, fontWeight: 500 }}>
                  {error}
                </Alert>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
