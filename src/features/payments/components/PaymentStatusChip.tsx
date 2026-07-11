'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { PaymentStatus } from '../payments.types';

type PaymentStatusChipProps = {
  status: PaymentStatus;
};

const chipColorByStatus: Record<PaymentStatus, 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  PENDING: 'warning',
  PARTIALLY_PAID: 'info',
  PAID: 'success',
  FAILED: 'error',
  CANCELLED: 'default',
  REFUNDED: 'default',
};

export function PaymentStatusChip({ status }: PaymentStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Chip
      label={copy.payments.statuses[status]}
      color={chipColorByStatus[status]}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
