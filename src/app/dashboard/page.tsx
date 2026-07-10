'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageHeader } from '@/components/ui/PageHeader';
import { getModuleRoute, routes } from '@/lib/routes/routes';

const stats = [
  { label: 'Open Requests', value: '24', helper: 'Awaiting routing', color: '#1e3a8a', bg: '#dbeafe' },
  { label: 'Pending Quotations', value: '8', helper: 'Under evaluation', color: '#b45309', bg: '#fef3c7' },
  { label: 'Active Purchase Orders', value: '15', helper: 'Dispatched & open', color: '#0369a1', bg: '#e0f2fe' },
  { label: 'Awaiting Payments', value: '6', helper: 'Requires verification', color: '#7c2d12', bg: '#ffedd5' },
  { label: 'Deliveries In Progress', value: '11', helper: 'Shipments in transit', color: '#065f46', bg: '#d1fae5' },
  { label: 'Overdue Invoices', value: '3', helper: 'Immediate review', color: '#991b1b', bg: '#fee2e2' },
];

const mockActivities = [
  { text: 'RFQ-2026-9041 Created for Steel Pipes by Al-Nasr Contracting', time: '2 hours ago', tag: 'New Request', tagColor: 'info' },
  { text: 'Quotation Received from Sahara Logistics for RFQ-2026-8911', time: '4 hours ago', tag: 'Quote Recv', tagColor: 'success' },
  { text: 'Purchase Order PO-2026-0422 Approved by Admin', time: '1 day ago', tag: 'PO Approved', tagColor: 'primary' },
  { text: 'Payment Acknowledged for Invoice INV-2026-102', time: '2 days ago', tag: 'Paid', tagColor: 'secondary' },
];

const mockApprovals = [
  { title: 'RFQ-2026-9033 (Chemical Reagents)', detail: 'Awaiting supplier assignment by logistics desk.', level: 'Medium Priority' },
  { title: 'PO-2026-0419 (Heavy Machinery Parts)', detail: 'Value $82,400.00 - Requires second level operations override.', level: 'High Priority' },
  { title: 'Supplier Qualification: Gulf Industrial Ltd', detail: 'Pending verification of trade certificate and VAT register.', level: 'Low Priority' },
];

const liveModules = new Set(['requests', 'suppliers']);

export default function DashboardPage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDemoAction = () => {
    setSnackbarOpen(true);
  };

  return (
    <Stack spacing={4}>
      <PageHeader
        title="Procurement Operations Dashboard"
        description="Global status reporting, operational workflow tracking, and SupplyHub admin system control panel."
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={handleDemoAction}
              sx={{ px: 3, fontWeight: 700 }}
            >
              Create Request (Demo)
            </Button>
            <Button
              href={getModuleRoute('requests')}
              variant="outlined"
              sx={{ px: 3 }}
            >
              Manage Requests
            </Button>
          </Stack>
        }
      />

      {/* KPI Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(6, minmax(0, 1fr))',
          },
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.label} sx={{ height: '100%', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1.5, mb: 1, fontFamily: 'monospace', color: '#0f172a' }}>
                {stat.value}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Chip
                  label={stat.helper}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: stat.bg,
                    color: stat.color,
                    borderRadius: 0.5,
                    height: 20,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Main Dashboard Panels */}
      <Grid container spacing={3}>
        {/* Left Column: Activity & Overview */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* Procurement overview */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Procurement Operations Overview
                    </Typography>
                    <Chip label="Staging Data Only" size="small" variant="outlined" sx={{ color: 'text.secondary', fontWeight: 600 }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Operations are currently synchronized with staging APIs. Real-time data routing pipelines are configured for supplier response checks, bid evaluation thresholds, and delivery tracking integrations.
                  </Typography>
                  
                  <Box sx={{ mt: 1, p: 2.5, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} divider={<Divider orientation="vertical" flexItem sx={{ mx: 2 }} />} spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Average Cycle Time</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>4.2 Days</Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>↓ 14% from last month</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Supplier Response Rate</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>92.8%</Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>↑ 2.1% from last month</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Fulfillment Accuracy</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>98.4%</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Stable trajectory</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Recent activity placeholder */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent Operations Feed
                    </Typography>
                    <Chip label="Demo Logs" size="small" sx={{ bgcolor: '#e2e8f0', color: '#475569', fontWeight: 600, borderRadius: 0.5 }} />
                  </Stack>
                  <List disablePadding>
                    {mockActivities.map((act, index) => (
                      <Box key={index}>
                        {index > 0 && <Divider sx={{ my: 1.5 }} />}
                        <ListItem disableGutters sx={{ py: 0.5, alignItems: 'flex-start' }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                {act.text}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.75 }}>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                  {act.time}
                                </Typography>
                                <Chip
                                  label={act.tag}
                                  size="small"
                                  color={act.tagColor as any}
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    borderRadius: 0.5,
                                  }}
                                />
                              </Stack>
                            }
                          />
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column: Pending Approvals & Status */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Pending Approvals */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Pending Approvals Queue
                    </Typography>
                    <Chip label="Demo Queue" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600, borderRadius: 0.5 }} />
                  </Stack>
                  <Stack spacing={2}>
                    {mockApprovals.map((app, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#f8fafc',
                          '&:hover': { borderColor: '#b45309' },
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                              {app.title}
                            </Typography>
                            <Chip
                              label={app.level}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                borderRadius: 0.5,
                                bgcolor: app.level === 'High Priority' ? '#fee2e2' : '#f1f5f9',
                                color: app.level === 'High Priority' ? '#b91c1c' : '#475569',
                              }}
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                            {app.detail}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* System Status Indicators */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Core Services Status
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { name: 'Admin Web App', desc: 'Port 3000 / Next.js', ok: true },
                      { name: 'SupplyHub Backend API', desc: 'v1.0.0 / Express', ok: true },
                      { name: 'Database Adapter', desc: 'PostgreSQL Read/Write', ok: true },
                      { name: 'Operations Gate Auth', desc: 'JWT Bearer Guards', ok: true },
                    ].map((srv, idx) => (
                      <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            {srv.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {srv.desc}
                          </Typography>
                        </Box>
                        <Chip
                          icon={<CheckCircleOutlineIcon sx={{ fontSize: '0.9rem', color: '#047857 !important' }} />}
                          label="Active"
                          size="small"
                          sx={{
                            bgcolor: '#d1fae5',
                            color: '#065f46',
                            fontWeight: 700,
                            borderRadius: 0.5,
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Module quick entries */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Operations Module Registry
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Direct entry points to active modules and staging workflow dashboards.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {routes.modules.map((module) => (
                <Card
                  key={module.slug}
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderColor: 'divider',
                    background: '#ffffff',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                        label={liveModules.has(module.slug) ? 'Live Link' : 'Demo Placeholder'}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: liveModules.has(module.slug) ? '#d1fae5' : '#f1f5f9',
                          color: liveModules.has(module.slug) ? '#065f46' : '#475569',
                          fontWeight: 700,
                          borderRadius: 0.5,
                          fontSize: '0.65rem',
                        }}
                      />
                        {liveModules.has(module.slug) && (
                          <Chip
                            label="Live API"
                            size="small"
                            color="info"
                            sx={{ borderRadius: 0.5, fontSize: '0.65rem', fontWeight: 700, height: 20 }}
                          />
                        )}
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {module.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>
                      <Box sx={{ pt: 1 }}>
                        <Button
                          href={getModuleRoute(module.slug)}
                          variant="text"
                          endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)', fontSize: '0.9rem' }} />}
                          sx={{
                            p: 0,
                            color: '#0f172a',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            minWidth: 0,
                            '&:hover': { color: '#f59e0b', bgcolor: 'transparent' },
                          }}
                        >
                          Open Module
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar notification for the demo button */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          icon={<WarningAmberRoundedIcon sx={{ color: '#b45309' }} />}
          sx={{
            width: '100%',
            borderRadius: 1,
            bgcolor: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a',
            fontWeight: 600,
          }}
        >
          Operational Warning: This action is a placeholder for future integrations.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
