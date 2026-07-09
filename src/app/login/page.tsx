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
import Link from 'next/link';
import { routes } from '@/lib/routes/routes';

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Authentication integration is planned for Phase 17.1.');
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
                Sign in
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                This login form is a foundation placeholder. Real auth wiring
                comes in Phase 17.1.
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
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                fullWidth
                required
              />
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Stack>

            {message ? <Alert severity="info">{message}</Alert> : null}

            <Button component={Link} href={routes.dashboard} variant="text">
              Back to dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
