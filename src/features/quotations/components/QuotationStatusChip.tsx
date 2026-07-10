'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { QuotationStatus } from '../quotations.types';

const statusConfig: Record<QuotationStatus, { bgcolor: string; color: string }> = {
  DRAFT: { bgcolor: '#e2e8f0', color: '#334155' },
  RECEIVED: { bgcolor: '#dbeafe', color: '#1d4ed8' },
  SELECTED: { bgcolor: '#d1fae5', color: '#047857' },
  REJECTED: { bgcolor: '#fee2e2', color: '#b91c1c' },
  EXPIRED: { bgcolor: '#f1f5f9', color: '#475569' },
  CANCELLED: { bgcolor: '#f1f5f9', color: '#475569' },
};

type QuotationStatusChipProps = {
  status: QuotationStatus;
};

export function QuotationStatusChip({ status }: QuotationStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const config = statusConfig[status];

  return (
    <Chip
      label={copy.quotations.statuses[status]}
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
