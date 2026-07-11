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
import { InvoiceStatusChip } from '@/features/invoices/components/InvoiceStatusChip';
import { InvoicesErrorState } from '@/features/invoices/components/InvoicesErrorState';
import { getInvoiceById } from '@/features/invoices/invoices.api';
import type { InvoiceRecord } from '@/features/invoices/invoices.types';
import { getOrderRoute, routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type InvoiceDetailPageProps = {
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

const ItemValue = ({ value }: { value: string }) => (
  <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 500 }}>
    {value}
  </Typography>
);

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getInvoiceById(resolvedParams.id);

        if (!active) {
          return;
        }

        setInvoice(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setInvoice(null);
        setError(
          loadError instanceof Error ? loadError.message : copy.invoices.errors.detailLoadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadInvoice();

    return () => {
      active = false;
    };
  }, [copy.invoices.errors.detailLoadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.invoices.detailTitle}
        description={copy.invoices.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.invoices} variant="outlined">
              {copy.invoices.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <InvoicesErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="32%" height={44} />
              <Skeleton variant="rounded" width="100%" height={180} />
              <Skeleton variant="rounded" width="100%" height={320} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && invoice ? (
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
                      {copy.invoices.summaryTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatMoney(invoice.grandTotal, invoice.currency, locale)}
                    </Typography>
                  </Stack>
                  <InvoiceStatusChip status={invoice.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.invoices.columns.invoiceId} value={invoice.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.invoices.columns.orderId} value={invoice.orderId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.invoices.columns.companyId} value={invoice.companyId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.invoices.columns.type} value={copy.invoices.types[invoice.type]} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.invoices.columns.currency} value={invoice.currency} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.itemsSubtotal}
                      value={formatMoney(invoice.itemsSubtotal, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.discountTotal}
                      value={formatMoney(invoice.discountTotal, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.taxTotal}
                      value={formatMoney(invoice.taxTotal, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.grandTotal}
                      value={formatMoney(invoice.grandTotal, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.paidAmount}
                      value={formatMoney(invoice.paidAmount, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.outstandingAmount}
                      value={formatMoney(invoice.outstandingAmount, invoice.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.issuedAt}
                      value={formatDate(invoice.issuedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.dueAt}
                      value={formatDate(invoice.dueAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.paidAt}
                      value={formatDate(invoice.paidAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.cancelledAt}
                      value={formatDate(invoice.cancelledAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.voidedAt}
                      value={formatDate(invoice.voidedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.refundedAt}
                      value={formatDate(invoice.refundedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.created}
                      value={formatDate(invoice.createdAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.invoices.columns.updated}
                      value={formatDate(invoice.updatedAt, locale)}
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.invoices.orderSummaryTitle}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {invoice.order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatMoney(invoice.order.grandTotal, invoice.order.currency, locale)}
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.invoices.columns.orderStatus}
                          value={
                            copy.orders.statuses[
                              invoice.order.status as keyof typeof copy.orders.statuses
                            ] ?? invoice.order.status
                          }
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.invoices.columns.orderNumber} value={invoice.order.orderNumber} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.invoices.columns.orderId} value={invoice.order.id} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.invoices.columns.currency} value={invoice.order.currency} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.invoices.columns.orderGrandTotal}
                          value={formatMoney(invoice.order.grandTotal, invoice.order.currency, locale)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.shared.createdAt}
                          value={formatDate(invoice.order.createdAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.shared.updatedAt}
                          value={formatDate(invoice.order.updatedAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button href={getOrderRoute(invoice.orderId)} variant="outlined">
                          {copy.invoices.openOrder}
                        </Button>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.invoices.companySummaryTitle}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {invoice.company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {invoice.company.id}
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.invoices.columns.companyId} value={invoice.company.id} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.invoices.columns.companyStatus}
                          value={invoice.company.status}
                          mono
                        />
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
                      {copy.invoices.customerNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {invoice.customerNotes ?? copy.invoices.noNotes}
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
                      {copy.invoices.internalNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {invoice.internalNotes ?? copy.invoices.noNotes}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {copy.invoices.itemLinesTitle}
                </Typography>
                {invoice.items.length > 0 ? (
                  <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{copy.invoices.columns.item}</TableCell>
                          <TableCell>{copy.invoices.columns.description}</TableCell>
                          <TableCell>{copy.invoices.columns.orderItemId}</TableCell>
                          <TableCell align="right">{copy.invoices.columns.quantity}</TableCell>
                          <TableCell align="right">{copy.invoices.columns.unitPrice}</TableCell>
                          <TableCell align="right">{copy.invoices.columns.lineSubtotal}</TableCell>
                          <TableCell align="right">{copy.invoices.columns.taxAmount}</TableCell>
                          <TableCell align="right">{copy.invoices.columns.lineTotal}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoice.items.map((item) => (
                          <TableRow key={item.id}>
                          <TableCell>
                            <Stack spacing={0.25}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                  {item.id}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                                >
                                  {item.orderItemId ?? copy.shared.noData}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <ItemValue value={item.description ?? copy.shared.noData} />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                              {item.orderItemId ?? copy.shared.noData}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                            >
                              {formatNumber(item.quantity, locale)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                            >
                              {formatMoney(item.unitPrice, invoice.currency, locale)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                            >
                              {formatMoney(item.lineSubtotal, invoice.currency, locale)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                            >
                              {formatMoney(item.taxAmount, invoice.currency, locale)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                            >
                              {formatMoney(item.lineTotal, invoice.currency, locale)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {copy.invoices.noItems}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {copy.invoices.timelineTitle}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{copy.invoices.columns.event}</TableCell>
                        <TableCell>{copy.invoices.columns.value}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        [copy.invoices.columns.issuedAt, formatDate(invoice.issuedAt, locale)],
                        [copy.invoices.columns.dueAt, formatDate(invoice.dueAt, locale)],
                        [copy.invoices.columns.paidAt, formatDate(invoice.paidAt, locale)],
                        [copy.invoices.columns.cancelledAt, formatDate(invoice.cancelledAt, locale)],
                        [copy.invoices.columns.voidedAt, formatDate(invoice.voidedAt, locale)],
                        [copy.invoices.columns.refundedAt, formatDate(invoice.refundedAt, locale)],
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
