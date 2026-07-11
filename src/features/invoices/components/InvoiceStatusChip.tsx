'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { InvoiceStatus } from '../invoices.types';

type InvoiceStatusChipProps = {
  status: InvoiceStatus;
};

const chipColorByStatus: Record<
  InvoiceStatus,
  'default' | 'warning' | 'success' | 'error' | 'info'
> = {
  DRAFT: 'warning',
  ISSUED: 'info',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'error',
  CANCELLED: 'default',
  VOID: 'default',
  REFUNDED: 'default',
};

export function InvoiceStatusChip({ status }: InvoiceStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Chip
      label={copy.invoices.statuses[status]}
      color={chipColorByStatus[status]}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
