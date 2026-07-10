'use client';

import { useState } from 'react';
import {
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
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { getModuleRoute } from '@/lib/routes/routes';

export default function DashboardPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDemoAction = () => {
    setSnackbarOpen(true);
  };

  return (
    <Stack spacing={4}>
      <PageHeader
        title={copy.dashboard.title}
        description={copy.dashboard.description}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" onClick={handleDemoAction} sx={{ px: 3, fontWeight: 700 }}>
              {copy.dashboard.createRequest}
            </Button>
            <Button href={getModuleRoute('requests')} variant="outlined" sx={{ px: 3 }}>
              {copy.dashboard.manageRequests}
            </Button>
          </Stack>
        }
      />

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
        {copy.dashboard.stats.map((stat, index) => (
          <Card key={stat.label} sx={{ height: '100%', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mt: 1.5, mb: 1, fontFamily: 'monospace', color: '#0f172a' }}
              >
                {[
                  copy.dashboard.cycleTimeValue,
                  copy.dashboard.supplierResponseRateValue,
                  copy.dashboard.fulfillmentAccuracyValue,
                  '24',
                  '11',
                  '3',
                ][index]}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Chip
                  label={stat.helper}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor:
                      ['#dbeafe', '#fef3c7', '#e0f2fe', '#ffedd5', '#d1fae5', '#fee2e2'][index],
                    color:
                      ['#1e3a8a', '#b45309', '#0369a1', '#7c2d12', '#065f46', '#991b1b'][index],
                    borderRadius: 0.5,
                    height: 20,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.dashboard.overviewTitle}
                    </Typography>
                    <Chip
                      label={copy.dashboard.stagingBadge}
                      size="small"
                      variant="outlined"
                      sx={{ color: 'text.secondary', fontWeight: 600 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {copy.dashboard.overviewDescription}
                  </Typography>

                  <Box sx={{ mt: 1, p: 2.5, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      divider={<Divider orientation="vertical" flexItem sx={{ mx: 2 }} />}
                      spacing={2}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          {copy.dashboard.cycleTimeLabel}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>
                          {copy.dashboard.cycleTimeValue}
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                          ↑ 14%
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          {copy.dashboard.supplierResponseRateLabel}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>
                          {copy.dashboard.supplierResponseRateValue}
                        </Typography>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                          ↑ 2.1%
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          {copy.dashboard.fulfillmentAccuracyLabel}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, fontFamily: 'monospace', color: '#0f172a' }}>
                          {copy.dashboard.fulfillmentAccuracyValue}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {copy.dashboard.stableTrajectory}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.dashboard.recentFeedTitle}
                    </Typography>
                    <Chip
                      label={copy.dashboard.recentFeedBadge}
                      size="small"
                      sx={{ bgcolor: '#e2e8f0', color: '#475569', fontWeight: 600, borderRadius: 0.5 }}
                    />
                  </Stack>
                  <List disablePadding>
                    {copy.dashboard.activities.map((act, index) => (
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
                                  color={['info', 'success', 'primary', 'secondary'][index] as any}
                                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, borderRadius: 0.5 }}
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

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.dashboard.approvalsTitle}
                    </Typography>
                    <Chip
                      label={copy.dashboard.approvalsBadge}
                      size="small"
                      sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600, borderRadius: 0.5 }}
                    />
                  </Stack>
                  <Stack spacing={2}>
                    {copy.dashboard.approvals.map((app, index) => (
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
                                bgcolor: index === 1 ? '#fee2e2' : '#f1f5f9',
                                color: index === 1 ? '#b91c1c' : '#475569',
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

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {copy.dashboard.modulesTitle}
                  </Typography>
                  <Stack spacing={1.5}>
                    {[
                    { label: copy.dashboard.moduleRequests, route: getModuleRoute('requests'), icon: ArrowBackIcon, live: true },
                      { label: copy.dashboard.moduleSuppliers, route: getModuleRoute('suppliers'), icon: CheckCircleOutlineIcon, live: true },
                      { label: copy.dashboard.moduleQuotations, route: getModuleRoute('quotations'), icon: WarningAmberRoundedIcon, live: false },
                    ].map((module) => {
                      const Icon = module.icon;

                      return (
                        <Button
                          key={module.label}
                          href={module.route}
                          variant="outlined"
                          startIcon={<Icon />}
                          sx={{ justifyContent: 'space-between', px: 2, py: 1.2 }}
                        >
                          <Box component="span" sx={{ flex: 1, textAlign: 'start' }}>
                            {module.label}
                          </Box>
                          <Chip
                            label={module.live ? copy.dashboard.moduleLive : copy.dashboard.moduleComingSoon}
                            size="small"
                            sx={{ mr: 0.5, height: 20, fontWeight: 700 }}
                          />
                        </Button>
                      );
                    })}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={copy.dashboard.snackbarDemo}
      />
    </Stack>
  );
}
