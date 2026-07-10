'use client';

import { use, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequestActionsPanel } from '@/features/requests/components/RequestActionsPanel';
import { RequestStatusChip } from '@/features/requests/components/RequestStatusChip';
import { RequestsErrorState } from '@/features/requests/components/RequestsErrorState';
import { getRequestById } from '@/features/requests/requests.api';
import type { RequestRecord } from '@/features/requests/requests.types';
import { routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type RequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value: string | null, locale: 'ar' | 'en') => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const RequestField = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <Stack spacing={0.5}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        color: '#0f172a',
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.03em' : 'inherit',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [request, setRequest] = useState<RequestRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadRequest = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getRequestById(resolvedParams.id);

        if (!active) {
          return;
        }

        setRequest(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setRequest(null);
        setError(
          loadError instanceof Error ? loadError.message : copy.requests.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadRequest();

    return () => {
      active = false;
    };
  }, [copy.requests.errors.loadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.requests.detailTitle}
        description={copy.requests.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.requests} variant="outlined">
              {copy.requests.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <RequestsErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="28%" height={44} />
              <Skeleton variant="rounded" width="100%" height={160} />
              <Skeleton variant="rounded" width="100%" height={220} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && request ? (
        <Stack spacing={3}>
          <RequestActionsPanel
            requestId={request.id}
            currentStatus={request.status}
            onActionSuccess={handleRefresh}
          />

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.requests.requestLabel}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.description || copy.requests.noDescription}
                    </Typography>
                  </Stack>
                  <RequestStatusChip status={request.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.requests.columns.requestId} value={request.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.shared.status} value={copy.requests.requestStatuses[request.status]} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label={copy.requests.columns.neededBy}
                      value={formatDate(request.neededByDate, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.shared.createdAt} value={formatDate(request.createdAt, locale)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.shared.updatedAt} value={formatDate(request.updatedAt, locale)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.requests.detail.deliveryCity} value={request.deliveryCity ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.requests.detail.deliveredTo} value={request.deliveryAddress ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label={copy.requests.columns.itemCount} value={String(request.items.length)} mono />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.requests.detail.companyInfo}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <RequestField label={copy.requests.columns.name} value={request.company.name} />
                    <RequestField label={copy.shared.status} value={request.company.status} />
                    <RequestField label={copy.requests.columns.email} value={request.company.email ?? '-'} />
                    <RequestField label={copy.requests.columns.phone} value={request.company.phone ?? '-'} mono />
                    <RequestField label={copy.requests.columns.city} value={request.company.city ?? '-'} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.requests.detail.requestedByInfo}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <RequestField label={copy.requests.columns.name} value={request.requestedBy.name} />
                    <RequestField label={copy.requests.columns.email} value={request.requestedBy.email} />
                    <RequestField label={copy.requests.columns.role} value={request.requestedBy.role} />
                    <RequestField label={copy.shared.status} value={request.requestedBy.status} />
                    <RequestField
                      label={copy.requests.columns.companyId}
                      value={request.requestedBy.companyId ?? '-'}
                      mono
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {copy.requests.itemsTitle}
                </Typography>
                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{copy.requests.columns.item}</TableCell>
                        <TableCell>{copy.requests.columns.description}</TableCell>
                        <TableCell align="right">{copy.requests.columns.qty}</TableCell>
                        <TableCell>{copy.requests.columns.unit}</TableCell>
                        <TableCell>{copy.requests.columns.brand}</TableCell>
                        <TableCell align="right">{copy.requests.columns.budget}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {request.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                {item.name}
                              </Typography>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                {item.id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{item.description ?? '-'}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                            {item.quantity}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{item.unit}</TableCell>
                          <TableCell>{item.preferredBrand ?? '-'}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                            {item.estimatedBudget ?? '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {copy.requests.detail.requestHistoryTitle}
                  </Typography>
                  <Chip
                    label={copy.requests.detail.requestHistoryBadge}
                    size="small"
                    sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600, borderRadius: 0.5 }}
                  />
                </Stack>
                <Divider sx={{ borderColor: 'divider' }} />
                <Stack spacing={2}>
                  {[
                    { title: copy.requests.detail.requestConverted, desc: copy.requests.detail.requestConvertedDesc, time: copy.requests.detail.requestConvertedTime },
                    { title: copy.requests.detail.reviewCleared, desc: copy.requests.detail.reviewClearedDesc, time: copy.requests.detail.reviewClearedTime },
                    { title: copy.requests.detail.requestCreated, desc: copy.requests.detail.requestCreatedDesc, time: copy.requests.detail.requestCreatedTime },
                  ].map((log, idx) => (
                    <Box key={idx}>
                      {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                            {log.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {log.desc}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          {log.time}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {request.internalNotes ? (
            <Card sx={{ borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {copy.requests.internalNotesTitle}
                  </Typography>
                  <Divider sx={{ borderColor: 'divider' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {request.internalNotes}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
