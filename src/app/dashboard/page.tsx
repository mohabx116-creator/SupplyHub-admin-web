import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getModuleRoute, routes } from '@/lib/routes/routes';
import type { DashboardStat } from '@/features/dashboard/dashboard.types';

const stats: DashboardStat[] = [
  { label: 'Open Requests', value: '24', helper: 'Awaiting routing' },
  { label: 'Active Suppliers', value: '18', helper: 'Approved and active' },
  { label: 'Pending Orders', value: '12', helper: 'In progress' },
  { label: 'Unpaid Invoices', value: '7', helper: 'Requires follow-up' },
];

const modules = routes.modules;

export default function DashboardPage() {
  return (
    <Stack spacing={4}>
      <PageHeader
        title="Dashboard Overview"
        description="This foundation gives the admin team a polished shell, clear entry points, and room to wire live data in the next phases."
        actions={
          <Button href={routes.login} variant="outlined">
            Go to login
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.label} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.helper}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography variant="h6">Module entry points</Typography>
              <Typography variant="body2" color="text.secondary">
                Lightweight placeholders are in place for the main admin workstreams.
              </Typography>
            </Stack>
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
              {modules.map((module) => (
                <Card
                  key={module.slug}
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderColor: 'var(--border)',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(246,249,253,0.95))',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.5}>
                      <Chip
                        label="Placeholder"
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                          fontWeight: 700,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {module.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>
                      <Box>
                        <Button href={getModuleRoute(module.slug)} variant="text">
                          Open placeholder
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

      <EmptyState
        title="Real data wiring is not active yet"
        description="The shell is ready. Phase 17.1 will connect real auth, server state, and live module screens."
        actionLabel="Open login"
        actionHref={routes.login}
      />
    </Stack>
  );
}
