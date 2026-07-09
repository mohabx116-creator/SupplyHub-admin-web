'use client';

import { useState, type PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export function AdminShell({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppHeader onMenuClick={() => setMobileOpen((value) => !value)} />
        <Box
          component="main"
          sx={{
            flex: 1,
            py: { xs: 3, md: 4 },
            px: { xs: 2, md: 3 },
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
