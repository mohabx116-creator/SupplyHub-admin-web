'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { RequestStatus } from '../requests.types';

const statusConfig: Record<
  RequestStatus,
  { bgcolor: string; color: string }
> = {
  NEW: { bgcolor: '#dbeafe', color: '#1e40af' },
  NEEDS_REVIEW: { bgcolor: '#fef3c7', color: '#b45309' },
  NEEDS_CLARIFICATION: { bgcolor: '#fef3c7', color: '#b45309' },
  READY_FOR_SOURCING: { bgcolor: '#ffedd5', color: '#7c2d12' },
  SOURCING: { bgcolor: '#e0f2fe', color: '#0369a1' },
  SUPPLIER_QUOTES_RECEIVED: { bgcolor: '#d1fae5', color: '#065f46' },
  CUSTOMER_QUOTE_SENT: { bgcolor: '#dbeafe', color: '#1e40af' },
  CUSTOMER_APPROVED: { bgcolor: '#d1fae5', color: '#065f46' },
  CUSTOMER_REJECTED: { bgcolor: '#fee2e2', color: '#b91c1c' },
  CANCELLED: { bgcolor: '#f1f5f9', color: '#475569' },
  CONVERTED_TO_ORDER: { bgcolor: '#d1fae5', color: '#065f46' },
};

type RequestStatusChipProps = {
  status: RequestStatus;
};

export function RequestStatusChip({ status }: RequestStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const config = statusConfig[status];

  return (
    <Chip
      label={copy.requests.requestStatuses[status]}
      size="small"
      sx={{
        fontWeight: 700,
        bgcolor: config.bgcolor,
        color: config.color,
        borderRadius: 1,
      }}
    />
  );
}
