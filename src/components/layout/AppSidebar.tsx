'use client';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getModuleRoute, routes } from '@/lib/routes/routes';

type AppSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

const navItems = [
  { label: 'Dashboard', href: routes.dashboard, icon: DashboardOutlinedIcon },
  { label: 'Requests', href: routes.requests, icon: RequestPageOutlinedIcon },
  { label: 'Suppliers', href: getModuleRoute('suppliers'), icon: StorefrontOutlinedIcon },
  { label: 'Quotations', href: getModuleRoute('quotations'), icon: ViewListOutlinedIcon },
  { label: 'Orders', href: getModuleRoute('orders'), icon: ShoppingCartOutlinedIcon },
  { label: 'Payments', href: getModuleRoute('payments'), icon: PaymentOutlinedIcon },
  { label: 'Deliveries', href: getModuleRoute('deliveries'), icon: LocalShippingOutlinedIcon },
  { label: 'Invoices', href: getModuleRoute('invoices'), icon: ReceiptLongOutlinedIcon },
] as const;

const drawerWidth = 300;

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();

  const drawerContent = (
    <Stack sx={{ height: '100%', p: 3, gap: 3 }}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          SupplyHub
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
          Admin Web
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enterprise dashboard foundation for staging and internal operations.
        </Typography>
      </Box>

      <Divider />

      <List disablePadding sx={{ display: 'grid', gap: 0.5 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={onMobileClose}
              sx={{
                borderRadius: 3,
                px: 2,
                py: 1.25,
                '&.Mui-selected': {
                  bgcolor: 'var(--brand-soft)',
                  '&:hover': { bgcolor: 'var(--brand-soft)' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 700 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          mt: 'auto',
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, var(--brand-soft), rgba(255,255,255,0.9))',
          border: '1px solid var(--border)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Phase 17.1
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Auth is wired. The next phase will focus on the first live admin modules and mutations.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderLeft: '1px solid var(--border)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(245,248,252,0.98) 100%)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
