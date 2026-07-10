'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { SupplierActionsPanel } from '@/features/suppliers/components/SupplierActionsPanel';
import { SuppliersEmptyState } from '@/features/suppliers/components/SuppliersEmptyState';
import { SuppliersErrorState } from '@/features/suppliers/components/SuppliersErrorState';
import { SuppliersLoadingState } from '@/features/suppliers/components/SuppliersLoadingState';
import { SuppliersTable } from '@/features/suppliers/components/SuppliersTable';
import { listSuppliers } from '@/features/suppliers/suppliers.api';
import {
  supplierStatuses,
  type ListSuppliersParams,
  type SupplierRecord,
  type SupplierStatus,
} from '@/features/suppliers/suppliers.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type SupplierFilterDraft = {
  status: SupplierStatus | '';
  city: string;
  category: string;
  search: string;
};

const initialDraftFilters: SupplierFilterDraft = {
  status: '',
  city: '',
  category: '',
  search: '',
};

const hasDraftValues = (draft: SupplierFilterDraft) =>
  Boolean(draft.status || draft.city.trim() || draft.category.trim() || draft.search.trim());

const toQueryParams = (draft: SupplierFilterDraft): ListSuppliersParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.city.trim() ? { city: draft.city.trim() } : {}),
  ...(draft.category.trim() ? { category: draft.category.trim() } : {}),
  ...(draft.search.trim() ? { search: draft.search.trim() } : {}),
});

export default function SuppliersPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [draftFilters, setDraftFilters] = useState<SupplierFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListSuppliersParams>({});
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const activeFilterCount = useMemo(() => Object.keys(appliedFilters).length, [appliedFilters]);

  useEffect(() => {
    let active = true;

    const loadSuppliers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listSuppliers(appliedFilters);

        if (!active) {
          return;
        }

        setSuppliers(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setSuppliers([]);
        setError(
          loadError instanceof Error ? loadError.message : copy.suppliers.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadSuppliers();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.suppliers.errors.loadFailed, refreshTick]);

  const handleApplyFilters = () => {
    setAppliedFilters(toQueryParams(draftFilters));
  };

  const handleResetFilters = () => {
    setDraftFilters(initialDraftFilters);
    setAppliedFilters({});
  };

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  const canReset = hasDraftValues(draftFilters) || activeFilterCount > 0;
  const showResults = !isLoading && !error;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.suppliers.listTitle}
        description={copy.suppliers.listDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button onClick={handleResetFilters} variant="outlined" disabled={!canReset}>
              {copy.suppliers.reset}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      <Card sx={{ borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {copy.suppliers.list.searchTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.suppliers.list.searchDescription}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.suppliers.list.statusLabel}
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value as SupplierStatus | '',
                  }))
                }
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                <MenuItem value="">{copy.suppliers.list.allStatuses}</MenuItem>
                {supplierStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.suppliers.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={copy.suppliers.list.cityLabel}
                value={draftFilters.city}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
                placeholder={copy.suppliers.list.cityPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              />
              <TextField
                label={copy.suppliers.list.categoryLabel}
                value={draftFilters.category}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder={copy.suppliers.list.categoryPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              />
              <TextField
                label={copy.suppliers.list.searchLabel}
                value={draftFilters.search}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder={copy.suppliers.list.searchPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 280 } }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                {copy.suppliers.list.apply}
              </Button>
              <Button onClick={handleResetFilters} variant="outlined">
                {copy.suppliers.list.clear}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <SupplierActionsPanel context="list" onMutationSuccess={handleRefresh} />

      {error ? <SuppliersErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? <SuppliersLoadingState /> : null}

      {showResults ? (
        suppliers.length > 0 ? (
          <SuppliersTable suppliers={suppliers} />
        ) : (
          <SuppliersEmptyState onRefresh={handleRefresh} />
        )
      ) : null}
    </Stack>
  );
}
