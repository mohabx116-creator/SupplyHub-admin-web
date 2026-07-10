'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequestsEmptyState } from '@/features/requests/components/RequestsEmptyState';
import { RequestsErrorState } from '@/features/requests/components/RequestsErrorState';
import { RequestsLoadingState } from '@/features/requests/components/RequestsLoadingState';
import { RequestsTable } from '@/features/requests/components/RequestsTable';
import { listRequests } from '@/features/requests/requests.api';
import type { RequestRecord, RequestStatus } from '@/features/requests/requests.types';
import { requestStatuses } from '@/features/requests/requests.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type RequestStatusFilter = 'all' | RequestStatus;

const getStatusLabelByLocale = (locale: 'ar' | 'en') => {
  const copy = getMessageBundle(locale);

  return {
    all: copy.requests.filterAll,
    NEW: copy.requests.requestStatuses.NEW,
    NEEDS_REVIEW: copy.requests.requestStatuses.NEEDS_REVIEW,
    NEEDS_CLARIFICATION: copy.requests.requestStatuses.NEEDS_CLARIFICATION,
    READY_FOR_SOURCING: copy.requests.requestStatuses.READY_FOR_SOURCING,
    SOURCING: copy.requests.requestStatuses.SOURCING,
    SUPPLIER_QUOTES_RECEIVED: copy.requests.requestStatuses.SUPPLIER_QUOTES_RECEIVED,
    CUSTOMER_QUOTE_SENT: copy.requests.requestStatuses.CUSTOMER_QUOTE_SENT,
    CUSTOMER_APPROVED: copy.requests.requestStatuses.CUSTOMER_APPROVED,
    CUSTOMER_REJECTED: copy.requests.requestStatuses.CUSTOMER_REJECTED,
    CANCELLED: copy.requests.requestStatuses.CANCELLED,
    CONVERTED_TO_ORDER: copy.requests.requestStatuses.CONVERTED_TO_ORDER,
  } as const satisfies Record<RequestStatusFilter, string>;
};

export default function RequestsPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const statusLabelByValue = getStatusLabelByLocale(locale);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<RequestStatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listRequests(
          statusFilter === 'all' ? undefined : { status: statusFilter },
        );

        if (!active) {
          return;
        }

        setRequests(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setRequests([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : copy.requests.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadRequests();

    return () => {
      active = false;
    };
  }, [copy.requests.errors.loadFailed, refreshTick, statusFilter]);

  const handleFilterChange = (event: SelectChangeEvent<RequestStatusFilter>) => {
    setStatusFilter(event.target.value as RequestStatusFilter);
  };

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  const showEmptyState = !isLoading && !error && requests.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.requests.listTitle}
        description={copy.requests.listDescription}
        actions={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="request-status-filter-label" sx={{ fontWeight: 600 }}>
                {copy.requests.filterLabel}
              </InputLabel>
              <Select
                labelId="request-status-filter-label"
                label={copy.requests.filterLabel}
                value={statusFilter}
                onChange={handleFilterChange}
                sx={{
                  bgcolor: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0f172a',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f59e0b',
                  },
                }}
              >
                {Object.entries(statusLabelByValue).map(([value, label]) => (
                  <MenuItem key={value} value={value} sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleRefresh}
              variant="outlined"
              size="medium"
              sx={{ minWidth: 120 }}
            >
              {copy.shared.refresh}
            </Button>
          </Stack>
        }
      />

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {copy.requests.activeFilter}:&nbsp;
            <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {statusLabelByValue[statusFilter]}
            </Box>
            &nbsp;• {requests.length} {copy.requests.activeEntries}
          </Typography>
        </Stack>
        {error ? <RequestsErrorState message={error} onRetry={handleRefresh} /> : null}
        {isLoading ? <RequestsLoadingState /> : null}
        {showEmptyState ? <RequestsEmptyState onRefresh={handleRefresh} /> : null}
        {!isLoading && !error && requests.length > 0 ? (
          <RequestsTable requests={requests} />
        ) : null}
      </Box>
    </Stack>
  );
}
