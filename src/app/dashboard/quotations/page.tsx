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
import { QuotationsEmptyState } from '@/features/quotations/components/QuotationsEmptyState';
import { QuotationsErrorState } from '@/features/quotations/components/QuotationsErrorState';
import { QuotationsLoadingState } from '@/features/quotations/components/QuotationsLoadingState';
import { QuotationsTable } from '@/features/quotations/components/QuotationsTable';
import { listSupplierQuotations } from '@/features/quotations/quotations.api';
import {
  quotationStatuses,
  type ListQuotationsParams,
  type QuotationRecord,
  type QuotationStatus,
} from '@/features/quotations/quotations.types';
import { listRequests } from '@/features/requests/requests.api';
import type { RequestRecord } from '@/features/requests/requests.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type QuotationFilterDraft = {
  status: QuotationStatus | '';
  supplierId: string;
};

const initialDraftFilters: QuotationFilterDraft = {
  status: '',
  supplierId: '',
};

const hasDraftValues = (draft: QuotationFilterDraft) =>
  Boolean(draft.status || draft.supplierId.trim());

const toQueryParams = (draft: QuotationFilterDraft): ListQuotationsParams => ({
  ...(draft.status ? { status: draft.status } : {}),
  ...(draft.supplierId.trim() ? { supplierId: draft.supplierId.trim() } : {}),
});

export default function QuotationsPage() {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | ''>('');
  const [draftFilters, setDraftFilters] = useState<QuotationFilterDraft>(initialDraftFilters);
  const [appliedFilters, setAppliedFilters] = useState<ListQuotationsParams>({});
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [quotationsError, setQuotationsError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const effectiveRequestId = useMemo(() => {
    if (selectedRequestId && requests.some((request) => request.id === selectedRequestId)) {
      return selectedRequestId;
    }

    return requests[0]?.id ?? '';
  }, [requests, selectedRequestId]);

  const effectiveRequest = useMemo(
    () => requests.find((request) => request.id === effectiveRequestId) ?? null,
    [requests, effectiveRequestId],
  );

  const canResetFilters = hasDraftValues(draftFilters) || Object.keys(appliedFilters).length > 0;

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
            : copy.quotations.errors.loadRequestsFailed,
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
  }, [copy.quotations.errors.loadRequestsFailed, refreshTick]);

  useEffect(() => {
    let active = true;

    if (!effectiveRequestId) {
      return undefined;
    }

    const loadQuotations = async () => {
      setIsLoadingQuotations(true);
      setQuotationsError(null);

      try {
        const data = await listSupplierQuotations(effectiveRequestId, appliedFilters);

        if (!active) {
          return;
        }

        setQuotations(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setQuotations([]);
        setQuotationsError(
          loadError instanceof Error ? loadError.message : copy.quotations.errors.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoadingQuotations(false);
        }
      }
    };

    void loadQuotations();

    return () => {
      active = false;
    };
  }, [appliedFilters, copy.quotations.errors.loadFailed, effectiveRequestId, refreshTick]);

  const handleRequestChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedRequestId(event.target.value);
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

  const showRequestsEmptyState = !isLoadingRequests && !requestsError && requests.length === 0;
  const showQuotationsEmptyState =
    !isLoadingQuotations && !quotationsError && effectiveRequestId && quotations.length === 0;

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.quotations.listTitle}
        description={copy.quotations.listDescription}
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
                {copy.quotations.filterSectionTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.quotations.filterSectionDescription}
              </Typography>
            </Stack>

            <TextField
              select
              label={copy.quotations.requestSelectorLabel}
              value={effectiveRequestId}
              onChange={handleRequestChange}
              helperText={copy.quotations.requestSelectorHelper}
              sx={{ maxWidth: { xs: '100%', md: 640 } }}
            >
              {requests.map((request) => (
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

            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {copy.quotations.selectedRequestLabel}:{' '}
                <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {effectiveRequest?.title ?? copy.shared.noData}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy.quotations.selectedRequestHelper}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <TextField
                select
                label={copy.quotations.statusLabel}
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value as QuotationStatus | '',
                  }))
                }
                sx={{ minWidth: { xs: '100%', md: 220 } }}
              >
                <MenuItem value="">{copy.quotations.allStatuses}</MenuItem>
                {quotationStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {copy.quotations.statuses[status]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={copy.quotations.supplierIdLabel}
                value={draftFilters.supplierId}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    supplierId: event.target.value,
                  }))
                }
                placeholder={copy.quotations.supplierIdPlaceholder}
                sx={{ minWidth: { xs: '100%', md: 320 } }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button onClick={handleApplyFilters} variant="contained" disabled={!effectiveRequestId}>
                {copy.quotations.applyFilters}
              </Button>
              <Button onClick={handleClearFilters} variant="outlined">
                {copy.quotations.clearFilters}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {copy.quotations.selectedRequestLabel}:{' '}
          <Typography component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {effectiveRequest?.title ?? copy.shared.noData}
          </Typography>
          {effectiveRequest ? (
            <>
              {' '}
              • {effectiveRequest.company.name}
            </>
          ) : null}
        </Typography>
      </Stack>

      {requestsError ? <QuotationsErrorState message={requestsError} onRetry={handleRefresh} /> : null}
      {quotationsError ? (
        <QuotationsErrorState message={quotationsError} onRetry={handleRefresh} />
      ) : null}

      {isLoadingRequests || isLoadingQuotations ? <QuotationsLoadingState /> : null}

      {showRequestsEmptyState ? (
        <QuotationsEmptyState onRefresh={handleRefresh} variant="requests" />
      ) : null}

      {!isLoadingRequests && !requestsError && effectiveRequest && !quotationsError ? (
        showQuotationsEmptyState ? (
          <QuotationsEmptyState onRefresh={handleRefresh} />
        ) : quotations.length > 0 ? (
          <QuotationsTable quotations={quotations} />
        ) : null
      ) : null}
    </Stack>
  );
}
