'use client';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { getModuleBySlug, routes } from '@/lib/routes/routes';

type AppHeaderProps = {
  onMenuClick: () => void;
};

const getPageTitle = (pathname: string) => {
  if (pathname === routes.dashboard) {
    return 'Dashboard';
  }

  if (pathname === routes.login) {
    return 'Login';
  }

  const moduleSlug = pathname.split('/').at(-1);
  const moduleConfig = moduleSlug ? getModuleBySlug(moduleSlug) : undefined;

  return moduleConfig?.label ?? 'SupplyHub Admin';
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.78)',
        color: 'text.primary',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <Toolbar sx={{ minHeight: 76, gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="text.secondary">
            SupplyHub Admin
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {pageTitle}
            </Typography>
            <Chip
              label="Staging"
              color="secondary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Foundation build
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
