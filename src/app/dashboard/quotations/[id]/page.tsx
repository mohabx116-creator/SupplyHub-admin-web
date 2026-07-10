'use client';

import { use, useEffect, useState } from 'react';
import {
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
import { QuotationStatusChip } from '@/features/quotations/components/QuotationStatusChip';
import { QuotationsErrorState } from '@/features/quotations/components/QuotationsErrorState';
import { getSupplierQuotationById } from '@/features/quotations/quotations.api';
import type { QuotationRecord } from '@/features/quotations/quotations.types';
import { getRequestRoute, routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type QuotationDetailPageProps = {
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
      }}
    >
      {value}
    </Typography>
  </Stack>
);

export default function QuotationDetailPage({ params }: QuotationDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [quotation, setQuotation] = useState<QuotationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadQuotation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSupplierQuotationById(resolvedParams.id);

        if (!active) {
          return;
        }

        setQuotation(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setQuotation(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : copy.quotations.errors.detailLoadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadQuotation();

    return () => {
      active = false;
    };
  }, [copy.quotations.errors.detailLoadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.quotations.detailTitle}
        description={copy.quotations.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.quotations} variant="outlined">
              {copy.quotations.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <QuotationsErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="28%" height={44} />
              <Skeleton variant="rounded" width="100%" height={160} />
              <Skeleton variant="rounded" width="100%" height={260} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && quotation ? (
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
                      {copy.quotations.quotationSummaryTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {quotation.id.slice(0, 8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatMoney(quotation.grandTotal, quotation.currency, locale)}
                    </Typography>
                  </Stack>
                  <QuotationStatusChip status={quotation.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.quotationId} value={quotation.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.requestId} value={quotation.requestId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.supplierId} value={quotation.supplierId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.currency} value={quotation.currency} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.subtotal} value={formatMoney(quotation.subtotal, quotation.currency, locale)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.shippingCost} value={formatMoney(quotation.shippingCost, quotation.currency, locale)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.taxAmount} value={formatMoney(quotation.taxAmount, quotation.currency, locale)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.discountAmount} value={formatMoney(quotation.discountAmount, quotation.currency, locale)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.quotations.columns.grandTotal} value={formatMoney(quotation.grandTotal, quotation.currency, locale)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.quotations.validUntilLabel}
                      value={quotation.validUntil ? formatDate(quotation.validUntil, locale) : copy.quotations.noValidUntil}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.quotations.leadTimeLabel}
                      value={
                        quotation.leadTimeDays !== null
                          ? formatNumber(String(quotation.leadTimeDays), locale)
                          : copy.shared.noData
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.shared.createdAt} value={formatDate(quotation.createdAt, locale)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.shared.updatedAt} value={formatDate(quotation.updatedAt, locale)} mono />
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
                      {copy.quotations.requestSummaryTitle}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Field label={copy.quotations.columns.request} value={quotation.request.title} />
                    <Field
                      label={copy.quotations.columns.requestCompany}
                      value={quotation.request.company.name}
                    />
                    <Field
                      label={copy.quotations.columns.requestStatus}
                      value={
                        copy.requests.requestStatuses[
                          quotation.request.status as keyof typeof copy.requests.requestStatuses
                        ]
                      }
                    />
                    <Button href={getRequestRoute(quotation.request.id)} variant="outlined" sx={{ alignSelf: 'flex-start' }}>
                      {copy.quotations.openRequest}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {copy.quotations.supplierSummaryTitle}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Field label={copy.quotations.columns.supplier} value={quotation.supplier.name} />
                    <Field
                      label={copy.quotations.columns.supplierLegalName}
                      value={quotation.supplier.legalName ?? copy.shared.noData}
                    />
                    <Field
                      label={copy.quotations.columns.supplierEmail}
                      value={quotation.supplier.email ?? copy.shared.noData}
                    />
                    <Field
                      label={copy.quotations.columns.supplierPhone}
                      value={quotation.supplier.phone ?? copy.shared.noData}
                      mono
                    />
                    <Field
                      label={copy.quotations.columns.supplierWhatsApp}
                      value={quotation.supplier.whatsapp ?? copy.shared.noData}
                      mono
                    />
                    <Field
                      label={copy.quotations.columns.supplierCity}
                      value={quotation.supplier.city ?? copy.shared.noData}
                    />
                    <Field
                      label={copy.quotations.columns.supplierAddress}
                      value={quotation.supplier.address ?? copy.shared.noData}
                    />
                    <Field
                      label={copy.quotations.columns.supplierTaxNumber}
                      value={quotation.supplier.taxNumber ?? copy.shared.noData}
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
                  {copy.quotations.lineItemsTitle}
                </Typography>
                {quotation.items.length > 0 ? (
                  <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{copy.quotations.columns.item}</TableCell>
                          <TableCell>{copy.quotations.columns.description}</TableCell>
                          <TableCell align="right">{copy.quotations.columns.quantity}</TableCell>
                          <TableCell>{copy.quotations.columns.unit}</TableCell>
                          <TableCell align="right">{copy.quotations.columns.unitPrice}</TableCell>
                          <TableCell align="right">{copy.quotations.columns.lineTotal}</TableCell>
                          <TableCell>{copy.quotations.columns.notes}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {quotation.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Stack spacing={0.25}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                                >
                                  {item.id}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{item.description ?? copy.shared.noData}</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                              {formatNumber(item.quantity, locale)}
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                              {formatMoney(item.unitPrice, quotation.currency, locale)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                              {formatMoney(item.lineTotal, quotation.currency, locale)}
                            </TableCell>
                            <TableCell>{item.notes ?? copy.quotations.noNotes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Chip
                    label={copy.quotations.noLineItems}
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </Stack>
  );
}
