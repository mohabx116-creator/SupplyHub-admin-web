'use client';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { clearStoredAccessToken } from '@/features/auth/auth.storage';
import { useAuthStore } from '@/features/auth/auth.store';
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
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pageTitle = getPageTitle(pathname);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    clearStoredAccessToken();
    clearSession();
    setAnchorEl(null);
    router.replace(routes.login);
  };

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
        {user ? (
          <>
            <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Button
              onClick={(event) => setAnchorEl(event.currentTarget)}
              startIcon={
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 13 }}>
                  {user.name.slice(0, 1).toUpperCase()}
                </Avatar>
              }
              variant="text"
              sx={{ color: 'text.primary', px: 1.5 }}
            >
              <Stack spacing={0} alignItems="flex-start">
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.role}
                </Typography>
              </Stack>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                {user.email}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
