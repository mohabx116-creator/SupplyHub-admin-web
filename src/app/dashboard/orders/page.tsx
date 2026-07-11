'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { OrdersEmptyState } from '@/features/orders/components/OrdersEmptyState';
import { OrdersErrorState } from '@/features/orders/components/OrdersErrorState';
import { OrdersLoadingState } from '@/features/orders/components/OrdersLoadingState';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import { listOrders } from '@/features/orders/orders.api';
import {
  orderStatuses,
  type ListOrdersParams,
  type OrderRecord,
  type OrderStatus,
} from '@/features/orders/orders.types';
import { listRequests } from '@/features/requests/requests.api';
import type { RequestRecord } from '@/features/requests/requests.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type OrderFilterDraft = {
  status: OrderStatus | '';
  requestId: string;
  search: string;
};

const initialDraftFilters: OrderFilterDraft = {
  status: '',
  requestId: '',
  search: '',
};

const hasDraftValues = (draft: OrderFilterDraft) =>
  Boolean(draft.status || draft.requestId.trim() || draft.search.trim());

const toQueryParams = (draft: OrderFilterDraft): ListOrdersParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.requestId.trim() ? { requestId: draft.requestId.trim() } : {}),
  ...(draft.search.trim() ? { search: draft.search.trim() } : {}),
});

const getStatusLabel = (locale: 'ar' | 'en', status: OrderStatus | '') => {
  const copy = getMessageBundle(locale);

  if (!status) {
    return copy.orders.allStatuses;
  }

  return copy.orders.statuses[status];
};

export default function PurchaseOrdersPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [draftFilters, setDraftFilters] = useState<OrderFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListOrdersParams>({});
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canResetFilters = hasDraftValues(draftFilters) || Object.keys(appliedFilters).length > 0;

  const requestOptions = useMemo(() => {
    return requests;
  }, [requests]);

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      setIsLoadingRequests(true);
      setRequestsError(null);

      try {
        const data = await listRequests();

        if (!active) {
          return;
        }

        setRequests(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setRequests([]);
        setRequestsError(
          loadError instanceof Error
            ? loadError.message
            : copy.orders.errors.loadRequestsFailed,
        );
      } finally {
        if (active) {
          setIsLoadingRequests(false);
        }
      }
    };

    void loadRequests();

    return () => {
      active = false;
    };
  }, [copy.orders.errors.loadRequestsFailed, refreshTick]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);

      try {
        const data = await listOrders(appliedFilters);

        if (!active) {
          return;
        }

        setOrders(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setOrders([]);
        setOrdersError(
          loadError instanceof Error ? loadError.message : copy.orders.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoadingOrders(false);
        }
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.orders.errors.loadFailed, refreshTick]);

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraftFilters((current) => ({
      ...current,
      status: event.target.value as OrderStatus | '',
    }));
  };

  const handleRequestChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraftFilters((current) => ({
      ...current,
      requestId: event.target.value,
    }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraftFilters((current) => ({
      ...current,
      search: event.target.value,
    }));
  };

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(toQueryParams(draftFilters));
  };

  const handleClearFilters = () => {
    setDraftFilters(initialDraftFilters);
    setAppliedFilters({});
  };

  const showOrdersEmptyState = !isLoadingOrders && !ordersError && orders.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.orders.listTitle}
        description={copy.orders.listDescription}
        actions={
          <Button onClick={handleRefresh} variant="contained">
            {copy.shared.refresh}
          </Button>
        }
      />

      <Card sx={{ borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {copy.orders.filterSectionTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.orders.filterSectionDescription}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.orders.requestSelectorLabel}
                value={draftFilters.requestId}
                onChange={handleRequestChange}
                helperText={copy.orders.requestSelectorHelper}
                sx={{ minWidth: { xs: '100%', md: 280 }, flex: '1 1 280px' }}
              >
                <MenuItem value="">{copy.orders.allRequests}</MenuItem>
                {requestOptions.map((request) => (
                  <MenuItem key={request.id} value={request.id}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {request.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.company.name}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={copy.orders.statusLabel}
                value={draftFilters.status}
                onChange={handleStatusChange}
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.orders.allStatuses}</MenuItem>
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.orders.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={copy.orders.searchLabel}
                value={draftFilters.search}
                onChange={handleSearchChange}
                placeholder={copy.orders.searchPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 280 }, flex: '1 1 280px' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                {copy.orders.applyFilters}
              </Button>
              <Button onClick={handleClearFilters} variant="outlined" disabled={!canResetFilters}>
                {copy.orders.clearFilters}
              </Button>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {copy.orders.selectedRequestLabel}:{' '}
                <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {draftFilters.requestId
                    ? requests.find((request) => request.id === draftFilters.requestId)?.title ??
                      draftFilters.requestId
                    : copy.orders.allRequests}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.orders.selectedRequestHelper}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.orders.statusLabel}:{' '}
                <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {getStatusLabel(locale, draftFilters.status)}
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {requestsError ? (
        <Typography variant="body2" color="error">
          {requestsError}
        </Typography>
      ) : null}

      {ordersError ? <OrdersErrorState message={ordersError} onRetry={handleRefresh} /> : null}
      {isLoadingRequests || isLoadingOrders ? <OrdersLoadingState /> : null}
      {showOrdersEmptyState ? <OrdersEmptyState onRefresh={handleRefresh} /> : null}
      {!isLoadingOrders && !ordersError && orders.length > 0 ? <OrdersTable orders={orders} /> : null}
    </Stack>
  );
}
