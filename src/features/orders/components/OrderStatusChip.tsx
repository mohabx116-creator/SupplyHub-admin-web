'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { OrderStatus } from '../orders.types';

type OrderStatusChipProps = {
  status: OrderStatus;
};

const chipStylesByStatus: Record<OrderStatus, { color: 'default' | 'info' | 'warning' | 'success' | 'error'; sx?: Record<string, unknown> }> = {
  DRAFT: { color: 'default' },
  CONFIRMED: { color: 'info' },
  PROCUREMENT_IN_PROGRESS: { color: 'warning' },
  READY_FOR_DELIVERY: { color: 'warning' },
  DELIVERED: { color: 'success' },
  CANCELLED: { color: 'error' },
};

export function OrderStatusChip({ status }: OrderStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Chip
      label={copy.orders.statuses[status]}
      color={chipStylesByStatus[status].color}
      size="small"
      sx={{ fontWeight: 700, ...chipStylesByStatus[status].sx }}
    />
  );
}
