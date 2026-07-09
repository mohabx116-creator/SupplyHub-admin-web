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
        bgcolor: '#ffffff',
        color: 'text.primary',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ minHeight: 76, gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: 'text.primary' }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.05em' }}>
            SupplyHub Admin
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {pageTitle}
            </Typography>
            <Chip
              label="Staging"
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: '#fef3c7',
                color: '#b45309',
                borderRadius: 1,
              }}
            />
          </Stack>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
        >
          Foundation Build v17.3
        </Typography>
        {user ? (
          <>
            <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', sm: 'block' }, borderColor: '#e2e8f0' }} />
            <Button
              onClick={(event) => setAnchorEl(event.currentTarget)}
              startIcon={
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#0f172a', color: '#ffffff', fontSize: 13, fontWeight: 700 }}>
                  {user.name.slice(0, 1).toUpperCase()}
                </Avatar>
              }
              variant="text"
              sx={{ color: 'text.primary', px: 1.5, '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}
            >
              <Stack spacing={0} alignItems="flex-start" sx={{ mr: 1, ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
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
              PaperProps={{
                sx: {
                  mt: 1,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary' }}>
                {user.email}
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
