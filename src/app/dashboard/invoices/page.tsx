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
import { InvoicesEmptyState } from '@/features/invoices/components/InvoicesEmptyState';
import { InvoicesErrorState } from '@/features/invoices/components/InvoicesErrorState';
import { InvoicesLoadingState } from '@/features/invoices/components/InvoicesLoadingState';
import { InvoicesTable } from '@/features/invoices/components/InvoicesTable';
import { listInvoices } from '@/features/invoices/invoices.api';
import {
  invoiceStatuses,
  invoiceTypes,
  type InvoiceStatus,
  type InvoiceType,
  type InvoiceRecord,
  type ListInvoicesParams,
} from '@/features/invoices/invoices.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type InvoiceFilterDraft = {
  status: InvoiceStatus | '';
  type: InvoiceType | '';
  companyId: string;
  orderId: string;
  invoiceNumber: string;
};

const initialDraftFilters: InvoiceFilterDraft = {
  status: '',
  type: '',
  companyId: '',
  orderId: '',
  invoiceNumber: '',
};

const hasDraftValues = (draft: InvoiceFilterDraft) =>
  Boolean(
    draft.status ||
      draft.type ||
      draft.companyId.trim() ||
      draft.orderId.trim() ||
      draft.invoiceNumber.trim(),
  );

const toQueryParams = (draft: InvoiceFilterDraft): ListInvoicesParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.type ? { type: draft.type } : {}),
  ...(draft.companyId.trim() ? { companyId: draft.companyId.trim() } : {}),
  ...(draft.orderId.trim() ? { orderId: draft.orderId.trim() } : {}),
  ...(draft.invoiceNumber.trim() ? { invoiceNumber: draft.invoiceNumber.trim() } : {}),
});

const getStatusLabel = (locale: 'ar' | 'en', status: InvoiceStatus | '') => {
  const copy = getMessageBundle(locale);

  if (!status) {
    return copy.invoices.allStatuses;
  }

  return copy.invoices.statuses[status];
};

const getTypeLabel = (locale: 'ar' | 'en', type: InvoiceType | '') => {
  const copy = getMessageBundle(locale);

  if (!type) {
    return copy.invoices.allTypes;
  }

  return copy.invoices.types[type];
};

export default function InvoicesPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [draftFilters, setDraftFilters] = useState<InvoiceFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListInvoicesParams>({});
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const canResetFilters = hasDraftValues(draftFilters) || Object.keys(appliedFilters).length > 0;

  useEffect(() => {
    let active = true;

    const loadInvoices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listInvoices(appliedFilters);

        if (!active) {
          return;
        }

        setInvoices(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setInvoices([]);
        setError(
          loadError instanceof Error ? loadError.message : copy.invoices.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadInvoices();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.invoices.errors.loadFailed, refreshTick]);

  const handleDraftChange = (key: keyof InvoiceFilterDraft, value: string) => {
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

  const showEmptyState = !isLoading && !error && invoices.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.invoices.listTitle}
        description={copy.invoices.listDescription}
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
                {copy.invoices.filterSectionTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.invoices.filterSectionDescription}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.invoices.statusLabel}
                value={draftFilters.status}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('status', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.invoices.allStatuses}</MenuItem>
                {invoiceStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.invoices.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label={copy.invoices.typeLabel}
                value={draftFilters.type}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  handleDraftChange('type', event.target.value)
                }
                sx={{ minWidth: { xs: '100%', md: 220 }, flex: '0 1 220px' }}
              >
                <MenuItem value="">{copy.invoices.allTypes}</MenuItem>
                {invoiceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {copy.invoices.types[type]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={copy.invoices.invoiceNumberLabel}
                value={draftFilters.invoiceNumber}
                onChange={(event) => handleDraftChange('invoiceNumber', event.target.value)}
                placeholder={copy.invoices.invoiceNumberPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 280 }, flex: '1 1 280px' }}
              />

              <TextField
                label={copy.invoices.orderIdLabel}
                value={draftFilters.orderId}
                onChange={(event) => handleDraftChange('orderId', event.target.value)}
                placeholder={copy.invoices.orderIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />

              <TextField
                label={copy.invoices.companyIdLabel}
                value={draftFilters.companyId}
                onChange={(event) => handleDraftChange('companyId', event.target.value)}
                placeholder={copy.invoices.companyIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 260 }, flex: '1 1 260px' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                {copy.invoices.applyFilters}
              </Button>
              <Button onClick={handleClearFilters} variant="outlined" disabled={!canResetFilters}>
                {copy.invoices.clearFilters}
              </Button>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {copy.invoices.selectedStatusLabel}:{' '}
                <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {getStatusLabel(locale, draftFilters.status)}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.invoices.selectedTypeLabel}:{' '}
                <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {getTypeLabel(locale, draftFilters.type)}
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <InvoicesErrorState message={error} onRetry={handleRefresh} /> : null}
      {isLoading ? <InvoicesLoadingState /> : null}
      {showEmptyState ? <InvoicesEmptyState onRefresh={handleRefresh} /> : null}
      {!isLoading && !error && invoices.length > 0 ? <InvoicesTable invoices={invoices} /> : null}
    </Stack>
  );
}
