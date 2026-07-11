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
import { PaymentStatusChip } from '@/features/payments/components/PaymentStatusChip';
import { PaymentsErrorState } from '@/features/payments/components/PaymentsErrorState';
import { getPaymentById } from '@/features/payments/payments.api';
import type { PaymentRecord, PaymentMethod } from '@/features/payments/payments.types';
import { getOrderRoute, routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type PaymentDetailPageProps = {
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

const formatNumber = (value: string, locale: 'ar' | 'en') => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return value;
  }

  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(numeric);
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

const getPaymentMethodLabel = (locale: 'ar' | 'en', method: PaymentMethod) => {
  const copy = getMessageBundle(locale);
  return copy.payments.methods[method];
};

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadPayment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPaymentById(resolvedParams.id);

        if (!active) {
          return;
        }

        setPayment(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setPayment(null);
        setError(
          loadError instanceof Error ? loadError.message : copy.payments.errors.detailLoadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadPayment();

    return () => {
      active = false;
    };
  }, [copy.payments.errors.detailLoadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.payments.detailTitle}
        description={copy.payments.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.payments} variant="outlined">
              {copy.payments.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <PaymentsErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="28%" height={44} />
              <Skeleton variant="rounded" width="100%" height={180} />
              <Skeleton variant="rounded" width="100%" height={320} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && payment ? (
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
                      {copy.payments.summaryTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                      {payment.reference ?? payment.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatMoney(payment.amount, payment.currency, locale)}
                    </Typography>
                  </Stack>
                  <PaymentStatusChip status={payment.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.payments.columns.paymentId} value={payment.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.payments.columns.orderId} value={payment.orderId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.payments.columns.companyId} value={payment.companyId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.reference}
                      value={payment.reference ?? copy.shared.noData}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.payments.columns.method} value={getPaymentMethodLabel(locale, payment.method)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.payments.columns.currency} value={payment.currency} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.amount}
                      value={formatMoney(payment.amount, payment.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.paidAmount}
                      value={formatMoney(payment.paidAmount, payment.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.outstandingAmount}
                      value={formatMoney(payment.outstandingAmount, payment.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.paidAt}
                      value={formatDate(payment.paidAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.failedAt}
                      value={formatDate(payment.failedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.cancelledAt}
                      value={formatDate(payment.cancelledAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.refundedAt}
                      value={formatDate(payment.refundedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.created}
                      value={formatDate(payment.createdAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.payments.columns.updated}
                      value={formatDate(payment.updatedAt, locale)}
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
                      {copy.payments.orderSummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {payment.order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatMoney(payment.order.grandTotal, payment.order.currency, locale)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.orderStatus}
                          value={
                            copy.orders.statuses[
                              payment.order.status as keyof typeof copy.orders.statuses
                            ] ?? payment.order.status
                          }
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.payments.columns.requestId} value={payment.order.requestId} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.customerQuotationId}
                          value={payment.order.customerQuotationId ?? copy.shared.noData}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.payments.columns.currency} value={payment.order.currency} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.orderGrandTotal}
                          value={formatMoney(payment.order.grandTotal, payment.order.currency, locale)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.confirmedAt}
                          value={formatDate(payment.order.confirmedAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.cancelledAt}
                          value={formatDate(payment.order.cancelledAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.payments.columns.deliveredAt}
                          value={formatDate(payment.order.deliveredAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button href={getOrderRoute(payment.orderId)} variant="outlined">
                          {copy.payments.openOrder}
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
                      {copy.payments.companySummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {payment.company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {payment.company.id}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.payments.columns.companyId} value={payment.company.id} mono />
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
                      {copy.payments.customerNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {payment.customerNotes ?? copy.payments.noNotes}
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
                      {copy.payments.internalNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {payment.internalNotes ?? copy.payments.noNotes}
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
                  {copy.payments.timelineTitle}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{copy.payments.columns.event}</TableCell>
                        <TableCell>{copy.payments.columns.value}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        [copy.payments.columns.paidAt, formatDate(payment.paidAt, locale)],
                        [copy.payments.columns.failedAt, formatDate(payment.failedAt, locale)],
                        [copy.payments.columns.cancelledAt, formatDate(payment.cancelledAt, locale)],
                        [copy.payments.columns.refundedAt, formatDate(payment.refundedAt, locale)],
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
