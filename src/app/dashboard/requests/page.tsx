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
import type {
  RequestRecord,
  RequestStatus,
} from '@/features/requests/requests.types';
import { requestStatuses } from '@/features/requests/requests.types';

type RequestStatusFilter = 'all' | RequestStatus;

const statusLabelByValue: Record<RequestStatusFilter, string> = {
  all: 'All statuses',
  NEW: 'New',
  NEEDS_REVIEW: 'Needs review',
  NEEDS_CLARIFICATION: 'Needs clarification',
  READY_FOR_SOURCING: 'Ready for sourcing',
  SOURCING: 'Sourcing',
  SUPPLIER_QUOTES_RECEIVED: 'Supplier quotes received',
  CUSTOMER_QUOTE_SENT: 'Customer quote sent',
  CUSTOMER_APPROVED: 'Customer approved',
  CUSTOMER_REJECTED: 'Customer rejected',
  CANCELLED: 'Cancelled',
  CONVERTED_TO_ORDER: 'Converted to order',
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<RequestStatusFilter>('all');
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
            : 'Unable to load requests right now.',
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
  }, [refreshTick, statusFilter]);

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
        title="Procurement Requests"
        description="Review and route incoming procurement requests connected to the live authenticated backend feed."
        actions={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="request-status-filter-label" sx={{ fontWeight: 600 }}>Filter Status</InputLabel>
              <Select
                labelId="request-status-filter-label"
                label="Filter Status"
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
              Refresh
            </Button>
          </Stack>
        }
      />

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Active Filter: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{statusLabelByValue[statusFilter]}</Box> • {requests.length} active entries
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
