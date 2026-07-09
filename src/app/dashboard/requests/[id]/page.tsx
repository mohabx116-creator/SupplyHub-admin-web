'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
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
  params: {
    id: string;
  };
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
}: {
  label: string;
  value: string;
}) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Stack>
);

export default function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
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
        const data = await getRequestById(params.id);

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
  }, [params.id, refreshTick]);

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

                <Divider />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label="Request ID" value={request.id} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField label="Status" value={request.status} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Needed by"
                      value={formatDate(request.neededByDate)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Created"
                      value={formatDate(request.createdAt)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <RequestField
                      label="Updated"
                      value={formatDate(request.updatedAt)}
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
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Company</Typography>
                    <RequestField label="Name" value={request.company.name} />
                    <RequestField label="Status" value={request.company.status} />
                    <RequestField
                      label="Email"
                      value={request.company.email ?? '—'}
                    />
                    <RequestField
                      label="Phone"
                      value={request.company.phone ?? '—'}
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
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Requested by</Typography>
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
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Items</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Brand</TableCell>
                        <TableCell>Budget</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {request.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700 }}
                              >
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{item.description ?? '—'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.preferredBrand ?? '—'}</TableCell>
                          <TableCell>{item.estimatedBudget ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>

          {request.internalNotes ? (
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6">Internal notes</Typography>
                  <Typography variant="body2" color="text.secondary">
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
