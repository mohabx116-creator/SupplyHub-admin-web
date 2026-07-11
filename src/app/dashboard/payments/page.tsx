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
import { PaymentsEmptyState } from '@/features/payments/components/PaymentsEmptyState';
import { PaymentsErrorState } from '@/features/payments/components/PaymentsErrorState';
import { PaymentsLoadingState } from '@/features/payments/components/PaymentsLoadingState';
import { PaymentsTable } from '@/features/payments/components/PaymentsTable';
import { listPayments } from '@/features/payments/payments.api';
import {
  paymentMethods,
  paymentStatuses,
  type ListPaymentsParams,
  type PaymentMethod,
  type PaymentRecord,
  type PaymentStatus,
} from '@/features/payments/payments.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type PaymentFilterDraft = {
  status: PaymentStatus | '';
  method: PaymentMethod | '';
  companyId: string;
  orderId: string;
  reference: string;
};

const initialDraftFilters: PaymentFilterDraft = {
  status: '',
  method: '',
  companyId: '',
  orderId: '',
  reference: '',
};

const hasDraftValues = (draft: PaymentFilterDraft) =>
  Boolean(draft.status || draft.method || draft.companyId.trim() || draft.orderId.trim() || draft.reference.trim());

const toQueryParams = (draft: PaymentFilterDraft): ListPaymentsParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.method ? { method: draft.method } : {}),
  ...(draft.companyId.trim() ? { companyId: draft.companyId.trim() } : {}),
  ...(draft.orderId.trim() ? { orderId: draft.orderId.trim() } : {}),
  ...(draft.reference.trim() ? { reference: draft.reference.trim() } : {}),
});

export default function PaymentsPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [draftFilters, setDraftFilters] = useState<PaymentFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListPaymentsParams>({});
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canResetFilters = hasDraftValues(draftFilters) || Object.keys(appliedFilters).length > 0;

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listPayments(appliedFilters);

        if (!active) {
          return;
        }

        setPayments(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setPayments([]);
        setError(
          loadError instanceof Error ? loadError.message : copy.payments.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadPayments();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.payments.errors.loadFailed, refreshTick]);

  const handleDraftChange = (
    key: keyof PaymentFilterDraft,
    value: string,
  ) => {
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

  const showEmptyState = !isLoading && !error && payments.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.payments.listTitle}
        description={copy.payments.listDescription}
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
                {copy.payments.filterSectionTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.payments.filterSectionDescription}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.payments.statusLabel}
                value={draftFilters.status}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('status', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.payments.allStatuses}</MenuItem>
                {paymentStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.payments.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={copy.payments.methodLabel}
                value={draftFilters.method}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('method', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.payments.allMethods}</MenuItem>
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {copy.payments.methods[method]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={copy.payments.referenceLabel}
                value={draftFilters.reference}
                onChange={(event) => handleDraftChange('reference', event.target.value)}
                placeholder={copy.payments.referencePlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />

              <TextField
                label={copy.payments.orderIdLabel}
                value={draftFilters.orderId}
                onChange={(event) => handleDraftChange('orderId', event.target.value)}
                placeholder={copy.payments.orderIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />

              <TextField
                label={copy.payments.companyIdLabel}
                value={draftFilters.companyId}
                onChange={(event) => handleDraftChange('companyId', event.target.value)}
                placeholder={copy.payments.companyIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                {copy.payments.applyFilters}
              </Button>
              <Button onClick={handleClearFilters} variant="outlined" disabled={!canResetFilters}>
                {copy.payments.clearFilters}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <PaymentsErrorState message={error} onRetry={handleRefresh} /> : null}
      {isLoading ? <PaymentsLoadingState /> : null}
      {showEmptyState ? <PaymentsEmptyState onRefresh={handleRefresh} /> : null}
      {!isLoading && !error && payments.length > 0 ? <PaymentsTable payments={payments} /> : null}
    </Stack>
  );
}
