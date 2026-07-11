'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { DeliveryStatus } from '../deliveries.types';

type DeliveryStatusChipProps = {
  status: DeliveryStatus;
};

const chipColorByStatus: Record<
  DeliveryStatus,
  'default' | 'warning' | 'success' | 'error' | 'info'
> = {
  PENDING: 'warning',
  SCHEDULED: 'info',
  IN_TRANSIT: 'info',
  DELIVERED: 'success',
  FAILED: 'error',
  CANCELLED: 'default',
  RETURNED: 'default',
};

export function DeliveryStatusChip({ status }: DeliveryStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Chip
      label={copy.deliveries.statuses[status]}
      color={chipColorByStatus[status]}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
