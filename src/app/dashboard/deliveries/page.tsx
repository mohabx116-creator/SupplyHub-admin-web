'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
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
import { DeliveriesEmptyState } from '@/features/deliveries/components/DeliveriesEmptyState';
import { DeliveriesErrorState } from '@/features/deliveries/components/DeliveriesErrorState';
import { DeliveriesLoadingState } from '@/features/deliveries/components/DeliveriesLoadingState';
import { DeliveriesTable } from '@/features/deliveries/components/DeliveriesTable';
import { listDeliveries } from '@/features/deliveries/deliveries.api';
import {
  deliveryMethods,
  deliveryStatuses,
  type DeliveryMethod,
  type DeliveryRecord,
  type DeliveryStatus,
  type ListDeliveriesParams,
} from '@/features/deliveries/deliveries.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type DeliveryFilterDraft = {
  status: DeliveryStatus | '';
  method: DeliveryMethod | '';
  companyId: string;
  orderId: string;
  trackingReference: string;
};

const initialDraftFilters: DeliveryFilterDraft = {
  status: '',
  method: '',
  companyId: '',
  orderId: '',
  trackingReference: '',
};

const hasDraftValues = (draft: DeliveryFilterDraft) =>
  Boolean(
    draft.status ||
      draft.method ||
      draft.companyId.trim() ||
      draft.orderId.trim() ||
      draft.trackingReference.trim(),
  );

const toQueryParams = (draft: DeliveryFilterDraft): ListDeliveriesParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.method ? { method: draft.method } : {}),
  ...(draft.companyId.trim() ? { companyId: draft.companyId.trim() } : {}),
  ...(draft.orderId.trim() ? { orderId: draft.orderId.trim() } : {}),
  ...(draft.trackingReference.trim()
    ? { trackingReference: draft.trackingReference.trim() }
    : {}),
});

export default function DeliveriesPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [draftFilters, setDraftFilters] = useState<DeliveryFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListDeliveriesParams>({});
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canResetFilters = hasDraftValues(draftFilters) || Object.keys(appliedFilters).length > 0;

  useEffect(() => {
    let active = true;

    const loadDeliveries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listDeliveries(appliedFilters);

        if (!active) {
          return;
        }

        setDeliveries(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setDeliveries([]);
        setError(
          loadError instanceof Error ? loadError.message : copy.deliveries.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadDeliveries();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.deliveries.errors.loadFailed, refreshTick]);

  const handleDraftChange = (key: keyof DeliveryFilterDraft, value: string) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
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

  const showEmptyState = !isLoading && !error && deliveries.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.deliveries.listTitle}
        description={copy.deliveries.listDescription}
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
                {copy.deliveries.filterSectionTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.deliveries.filterSectionDescription}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.deliveries.statusLabel}
                value={draftFilters.status}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('status', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.deliveries.allStatuses}</MenuItem>
                {deliveryStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.deliveries.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={copy.deliveries.methodLabel}
                value={draftFilters.method}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('method', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.deliveries.allMethods}</MenuItem>
                {deliveryMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {copy.deliveries.methods[method]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={copy.deliveries.trackingReferenceLabel}
                value={draftFilters.trackingReference}
                onChange={(event) => handleDraftChange('trackingReference', event.target.value)}
                placeholder={copy.deliveries.trackingReferencePlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />

              <TextField
                label={copy.deliveries.orderIdLabel}
                value={draftFilters.orderId}
                onChange={(event) => handleDraftChange('orderId', event.target.value)}
                placeholder={copy.deliveries.orderIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />

              <TextField
                label={copy.deliveries.companyIdLabel}
                value={draftFilters.companyId}
                onChange={(event) => handleDraftChange('companyId', event.target.value)}
                placeholder={copy.deliveries.companyIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                {copy.deliveries.applyFilters}
              </Button>
              <Button onClick={handleClearFilters} variant="outlined" disabled={!canResetFilters}>
                {copy.deliveries.clearFilters}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <DeliveriesErrorState message={error} onRetry={handleRefresh} /> : null}
      {isLoading ? <DeliveriesLoadingState /> : null}
      {showEmptyState ? <DeliveriesEmptyState onRefresh={handleRefresh} /> : null}
      {!isLoading && !error && deliveries.length > 0 ? (
        <DeliveriesTable deliveries={deliveries} />
      ) : null}
    </Stack>
  );
}
