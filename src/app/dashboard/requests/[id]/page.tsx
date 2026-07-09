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
import { RequestStatusChip } from '@/features/requests/components/RequestStatusChip';
import { RequestsErrorState } from '@/features/requests/components/RequestsErrorState';
import { getRequestById } from '@/features/requests/requests.api';
import type { RequestRecord } from '@/features/requests/requests.types';
import { routes } from '@/lib/routes/routes';

type RequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
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

export default function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const resolvedParams = use(params);
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
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load request details right now.',
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
  }, [resolvedParams.id, refreshTick]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Request details"
        description="Review the full admin-safe request record and its nested company, requester, and item information."
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.requests} variant="outlined">
              Back to Requests
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              Refresh
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
          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      Request
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.description || 'No description provided.'}
                    </Typography>
                  </Stack>
                  <RequestStatusChip status={request.status} />
                </Stack>

                <Divider />                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label="Request ID" value={request.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label="Status" value={request.status} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Needed by"
                      value={formatDate(request.neededByDate)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Created"
                      value={formatDate(request.createdAt)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Updated"
                      value={formatDate(request.updatedAt)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Delivery city"
                      value={request.deliveryCity ?? '—'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Delivery address"
                      value={request.deliveryAddress ?? '—'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Item count"
                      value={String(request.items.length)}
                      mono
                    />
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Company Info</Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <RequestField label="Name" value={request.company.name} />
                    <RequestField label="Status" value={request.company.status} />
                    <RequestField
                      label="Email"
                      value={request.company.email ?? '—'}
                    />
                    <RequestField
                      label="Phone"
                      value={request.company.phone ?? '—'}
                      mono
                    />
                    <RequestField
                      label="City"
                      value={request.company.city ?? '—'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Requested By</Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <RequestField
                      label="Name"
                      value={request.requestedBy.name}
                    />
                    <RequestField
                      label="Email"
                      value={request.requestedBy.email}
                    />
                    <RequestField label="Role" value={request.requestedBy.role} />
                    <RequestField
                      label="Status"
                      value={request.requestedBy.status}
                    />
                    <RequestField
                      label="Company ID"
                      value={request.requestedBy.companyId ?? '—'}
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
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Items Registry</Typography>
                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Brand</TableCell>
                        <TableCell align="right">Budget</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {request.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: '#0f172a' }}
                              >
                                {item.name}
                              </Typography>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                {item.id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{item.description ?? '—'}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{item.quantity}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{item.unit}</TableCell>
                          <TableCell>{item.preferredBrand ?? '—'}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{item.estimatedBudget ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>

          {/* Activity / Timeline Placeholder */}
          <Card sx={{ borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Request Activity History
                  </Typography>
                  <Chip label="Demo Logs Only" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600, borderRadius: 0.5 }} />
                </Stack>
                <Divider sx={{ borderColor: 'divider' }} />
                <Stack spacing={2}>
                  {[
                    { title: 'Request Converted to Sourcing', desc: 'Sourcing manager assigned the RFQ to qualified vendor pool.', time: 'July 10, 2026 10:15 AM' },
                    { title: 'Needs Review Flag Cleared', desc: 'Admin cleared flag after verifying delivery coordinates.', time: 'July 09, 2026 04:30 PM' },
                    { title: 'Request Created', desc: 'Initial payload received from API gateway.', time: 'July 09, 2026 09:12 AM' },
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
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Internal Notes</Typography>
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
