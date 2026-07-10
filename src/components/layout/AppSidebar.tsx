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
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { getModuleRoute, routes } from '@/lib/routes/routes';

type AppSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

const drawerWidth = 300;

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();
  const copy = getMessageBundle(useLocaleStore((state) => state.locale));

  const navItems = [
    { label: copy.dashboard.title, href: routes.dashboard, icon: DashboardOutlinedIcon },
    { label: copy.requests.listTitle, href: routes.requests, icon: RequestPageOutlinedIcon },
    { label: copy.suppliers.listTitle, href: routes.suppliers, icon: StorefrontOutlinedIcon },
    { label: copy.dashboard.moduleQuotations, href: getModuleRoute('quotations'), icon: ViewListOutlinedIcon },
    { label: copy.dashboard.moduleOrders, href: getModuleRoute('orders'), icon: ShoppingCartOutlinedIcon },
    { label: copy.dashboard.modulePayments, href: getModuleRoute('payments'), icon: PaymentOutlinedIcon },
    { label: copy.dashboard.moduleDeliveries, href: getModuleRoute('deliveries'), icon: LocalShippingOutlinedIcon },
    { label: copy.dashboard.moduleInvoices, href: getModuleRoute('invoices'), icon: ReceiptLongOutlinedIcon },
  ] as const;

  const drawerContent = (
    <Stack sx={{ height: '100%', p: 3, gap: 3, bgcolor: '#0f172a', color: '#f1f5f9' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            display: 'grid',
            placeItems: 'center',
            background: '#f59e0b',
            color: '#0f172a',
            fontWeight: 800,
            fontSize: '1.2rem',
          }}
        >
          SH
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff', lineHeight: 1.1 }}
          >
            {copy.shell.appName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {copy.shell.sidebarSubtitle}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: '#1e293b' }} />

      <List disablePadding sx={{ display: 'grid', gap: 0.75 }}>
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
                borderRadius: 1,
                px: 2,
                py: 1.25,
                color: active ? '#ffffff' : '#94a3b8',
                borderLeft: active ? '4px solid #f59e0b' : '4px solid transparent',
                backgroundColor: active ? 'rgba(255, 255, 255, 0.06) !important' : 'transparent',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  color: '#ffffff',
                  '& .MuiListItemIcon-root': { color: '#ffffff' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? '#f59e0b' : '#94a3b8' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.875rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          mt: 'auto',
          p: 2.5,
          borderRadius: 1,
          bgcolor: '#1e293b',
          border: '1px solid #334155',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
          {copy.dashboard.sidebarTitle}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.5, display: 'block', lineHeight: 1.4 }}>
          {copy.shell.sidebarFootnote}
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
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
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
            border: 'none',
            background: '#0f172a',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
