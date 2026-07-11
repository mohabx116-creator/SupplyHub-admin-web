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
import { OrdersErrorState } from '@/features/orders/components/OrdersErrorState';
import { OrderStatusChip } from '@/features/orders/components/OrderStatusChip';
import { getOrderById } from '@/features/orders/orders.api';
import type { OrderRecord } from '@/features/orders/orders.types';
import { getRequestRoute, routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type OrderDetailPageProps = {
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

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getOrderById(resolvedParams.id);

        if (!active) {
          return;
        }

        setOrder(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setOrder(null);
        setError(
          loadError instanceof Error ? loadError.message : copy.orders.errors.detailLoadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      active = false;
    };
  }, [copy.orders.errors.detailLoadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.orders.detailTitle}
        description={copy.orders.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.orders} variant="outlined">
              {copy.orders.backToList}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      {error ? <OrdersErrorState message={error} onRetry={handleRefresh} /> : null}

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

      {!isLoading && !error && order ? (
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
                      {copy.orders.orderSummaryTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatMoney(order.grandTotal, order.currency, locale)}
                    </Typography>
                  </Stack>
                  <OrderStatusChip status={order.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.orders.columns.orderId} value={order.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.orders.columns.requestId} value={order.requestId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.quotationId}
                      value={order.customerQuotationId ?? copy.shared.noData}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.orders.columns.companyId} value={order.companyId} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.orders.columns.currency} value={order.currency} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.subtotal}
                      value={formatMoney(order.itemsSubtotal, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.shippingCost}
                      value={formatMoney(order.shippingCost, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.serviceFee}
                      value={formatMoney(order.serviceFee, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.taxAmount}
                      value={formatMoney(order.taxAmount, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.discountAmount}
                      value={formatMoney(order.discountAmount, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.grandTotal}
                      value={formatMoney(order.grandTotal, order.currency, locale)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.confirmedAt}
                      value={formatDate(order.confirmedAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.cancelledAt}
                      value={formatDate(order.cancelledAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.deliveredAt}
                      value={formatDate(order.deliveredAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.created}
                      value={formatDate(order.createdAt, locale)}
                      mono
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field
                      label={copy.orders.columns.updated}
                      value={formatDate(order.updatedAt, locale)}
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
                      {copy.orders.requestSummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {order.request.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.request.company.name}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.requestStatus}
                          value={
                            copy.requests.requestStatuses[
                              order.request.status as keyof typeof copy.requests.requestStatuses
                            ] ?? order.request.status
                          }
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.orders.columns.requestCompany} value={order.request.company.name} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.orders.columns.requestId} value={order.request.id} mono />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field label={copy.orders.columns.companyId} value={order.request.company.id} mono />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button href={getRequestRoute(order.requestId)} variant="outlined">
                          {copy.orders.openRequest}
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
                      {copy.orders.quotationSummaryTitle}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {order.customerQuotation.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.customerQuotation.status}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.quotationId}
                          value={order.customerQuotation.id}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.requestId}
                          value={order.customerQuotation.requestId}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.status}
                          value={
                            copy.quotations.statuses[
                              order.customerQuotation.status as keyof typeof copy.quotations.statuses
                            ] ?? order.customerQuotation.status
                          }
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.currency}
                          value={order.customerQuotation.currency}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.grandTotal}
                          value={formatMoney(
                            order.customerQuotation.grandTotal,
                            order.customerQuotation.currency,
                            locale,
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.validUntil}
                          value={formatDate(order.customerQuotation.validUntil, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.sentAt}
                          value={formatDate(order.customerQuotation.sentAt, locale)}
                          mono
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field
                          label={copy.orders.columns.approvedAt}
                          value={formatDate(order.customerQuotation.approvedAt, locale)}
                          mono
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="overline" color="text.secondary">
                  {copy.orders.lineItemsTitle}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{copy.orders.columns.item}</TableCell>
                        <TableCell>{copy.orders.columns.description}</TableCell>
                        <TableCell>{copy.orders.columns.quantity}</TableCell>
                        <TableCell>{copy.orders.columns.unit}</TableCell>
                        <TableCell>{copy.orders.columns.unitPrice}</TableCell>
                        <TableCell>{copy.orders.columns.lineTotal}</TableCell>
                        <TableCell>{copy.orders.columns.notes}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              {copy.orders.noItems}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {item.id}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <ItemValue value={item.description ?? copy.shared.noData} />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {formatNumber(item.quantity, locale)}
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {formatMoney(item.unitPrice, order.currency, locale)}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {formatMoney(item.lineTotal, order.currency, locale)}
                            </TableCell>
                            <TableCell>
                              <ItemValue value={item.notes ?? copy.shared.noData} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.orders.customerNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {order.customerNotes ?? copy.orders.noNotes}
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
                      {copy.orders.internalNotesTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {order.internalNotes ?? copy.orders.noNotes}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      ) : null}
    </Stack>
  );
}
