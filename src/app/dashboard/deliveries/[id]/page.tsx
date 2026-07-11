'use client';

import { use, useEffect, useState } from 'react';
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
import { DeliveryStatusChip } from '@/features/deliveries/components/DeliveryStatusChip';
import { DeliveriesErrorState } from '@/features/deliveries/components/DeliveriesErrorState';
import { getDeliveryById } from '@/features/deliveries/deliveries.api';
import type { DeliveryMethod, DeliveryRecord } from '@/features/deliveries/deliveries.types';
import { getOrderRoute, routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type DeliveryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value: string | null, locale: 'ar' | 'en') => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const formatMoney = (value: string, currency: string, locale: 'ar' | 'en') => {
  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(numeric);
    } catch {
      return `${numeric.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 2,
      })} ${currency}`;
    }
  }

  return `${value} ${currency}`;
};

const Field = ({
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
        wordBreak: 'break-word',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const getDeliveryMethodLabel = (locale: 'ar' | 'en', method: DeliveryMethod) => {
  const copy = getMessageBundle(locale);
  return copy.deliveries.methods[method];
};

export default function DeliveryDetailPage({ params }: DeliveryDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [delivery, setDelivery] = useState<DeliveryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDelivery = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getDeliveryById(resolvedParams.id);

        if (!active) {
          return;
        }

        setDelivery(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setDelivery(null);
        setError(
          loadError instanceof Error ? loadError.message : copy.deliveries.errors.detailLoadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadDelivery();

    return () => {
      active = false;
    };
  }, [copy.deliveries.errors.detailLoadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.deliveries.detailTitle}
        description={copy.deliveries.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.deliveries} variant="outlined">
              {copy.deliveries.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <DeliveriesErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="28%" height={44} />
              <Skeleton variant="rounded" width="100%" height={200} />
              <Skeleton variant="rounded" width="100%" height={320} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && delivery ? (
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
                      {copy.deliveries.summaryTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                      {delivery.trackingReference ?? delivery.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getDeliveryMethodLabel(locale, delivery.method)}
                    </Typography>
                  </Stack>
                  <DeliveryStatusChip status={delivery.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.deliveries.columns.deliveryId} value={delivery.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.deliveries.columns.orderId} value={delivery.orderId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.deliveries.columns.companyId} value={delivery.companyId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.trackingReference}
                      value={delivery.trackingReference ?? copy.shared.noData}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.deliveryAddress}
                      value={delivery.deliveryAddress ?? copy.shared.noData}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.deliveryContactName}
                      value={delivery.deliveryContactName ?? copy.shared.noData}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.deliveryContactPhone}
                      value={delivery.deliveryContactPhone ?? copy.shared.noData}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.method}
                      value={getDeliveryMethodLabel(locale, delivery.method)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.deliveries.columns.currency} value={delivery.order.currency} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.orderGrandTotal}
                      value={formatMoney(delivery.order.grandTotal, delivery.order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.scheduledAt}
                      value={formatDate(delivery.scheduledAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.dispatchedAt}
                      value={formatDate(delivery.dispatchedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.deliveredAt}
                      value={formatDate(delivery.deliveredAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.failedAt}
                      value={formatDate(delivery.failedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.cancelledAt}
                      value={formatDate(delivery.cancelledAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.returnedAt}
                      value={formatDate(delivery.returnedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.created}
                      value={formatDate(delivery.createdAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.deliveries.columns.updated}
                      value={formatDate(delivery.updatedAt, locale)}
                      mono
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
                    <Typography variant="overline" color="text.secondary">
                      {copy.deliveries.orderSummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {delivery.order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatMoney(delivery.order.grandTotal, delivery.order.currency, locale)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.deliveries.columns.orderStatus}
                          value={
                            copy.orders.statuses[
                              delivery.order.status as keyof typeof copy.orders.statuses
                            ] ?? delivery.order.status
                          }
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.deliveries.columns.orderNumber} value={delivery.order.orderNumber} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.deliveries.columns.orderId} value={delivery.order.id} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.deliveries.columns.currency} value={delivery.order.currency} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.deliveries.columns.orderGrandTotal}
                          value={formatMoney(delivery.order.grandTotal, delivery.order.currency, locale)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.deliveries.columns.created}
                          value={formatDate(delivery.order.createdAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.deliveries.columns.updated}
                          value={formatDate(delivery.order.updatedAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button href={getOrderRoute(delivery.orderId)} variant="outlined">
                          {copy.deliveries.openOrder}
                        </Button>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.deliveries.companySummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {delivery.company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {delivery.company.id}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.deliveries.columns.companyId} value={delivery.company.id} mono />
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.deliveries.customerNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {delivery.customerNotes ?? copy.deliveries.noNotes}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.deliveries.internalNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {delivery.internalNotes ?? copy.deliveries.noNotes}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="overline" color="text.secondary">
                  {copy.deliveries.timelineTitle}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{copy.deliveries.columns.event}</TableCell>
                        <TableCell>{copy.deliveries.columns.value}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        [copy.deliveries.columns.scheduledAt, formatDate(delivery.scheduledAt, locale)],
                        [copy.deliveries.columns.dispatchedAt, formatDate(delivery.dispatchedAt, locale)],
                        [copy.deliveries.columns.deliveredAt, formatDate(delivery.deliveredAt, locale)],
                        [copy.deliveries.columns.failedAt, formatDate(delivery.failedAt, locale)],
                        [copy.deliveries.columns.cancelledAt, formatDate(delivery.cancelledAt, locale)],
                        [copy.deliveries.columns.returnedAt, formatDate(delivery.returnedAt, locale)],
                      ].map(([label, value]) => (
                        <TableRow key={label}>
                          <TableCell>{label}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </Stack>
  );
}
