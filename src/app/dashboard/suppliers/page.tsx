'use client';

import { useEffect, useMemo, useState } from 'react';
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

const formatStatusLabel = (status: SupplierStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

export default function SuppliersPage() {
  const [draftFilters, setDraftFilters] = useState<SupplierFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListSuppliersParams>({});
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const activeFilterCount = useMemo(
    () => Object.keys(appliedFilters).length,
    [appliedFilters],
  );

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
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load suppliers right now.',
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
  }, [appliedFilters, refreshTick]);

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
        title="Suppliers"
        description="Review the live supplier database, contact records, and operational status straight from the admin API."
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button onClick={handleResetFilters} variant="outlined" disabled={!canReset}>
              Reset
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              Refresh
            </Button>
          </Stack>
        }
      />

      <Card sx={{ borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Search and filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filter by supplier status, city, category, or free-text search.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <TextField
                select
                label="Status"
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value as SupplierStatus | '',
                  }))
                }
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                <MenuItem value="">All statuses</MenuItem>
                {supplierStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatStatusLabel(status)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="City"
                value={draftFilters.city}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
                placeholder="Cairo"
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              />
              <TextField
                label="Category"
                value={draftFilters.category}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder="Office supplies"
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              />
              <TextField
                label="Search"
                value={draftFilters.search}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Name, email, or phone"
                sx={{ minWidth: { xs: '100%', md: 280 } }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained">
                Apply filters
              </Button>
              <Button onClick={handleResetFilters} variant="outlined">
                Clear filters
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

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
