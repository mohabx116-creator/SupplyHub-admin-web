'use client';

import { Chip } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { SupplierStatus } from '../suppliers.types';

const statusConfig: Record<
  SupplierStatus,
  { bgcolor: string; color: string }
> = {
  ACTIVE: { bgcolor: '#d1fae5', color: '#065f46' },
  INACTIVE: { bgcolor: '#f1f5f9', color: '#475569' },
  BLACKLISTED: { bgcolor: '#fee2e2', color: '#b91c1c' },
};

type SupplierStatusChipProps = {
  status: SupplierStatus;
};

export function SupplierStatusChip({ status }: SupplierStatusChipProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const config = statusConfig[status];

  return (
    <Chip
      label={copy.suppliers.statuses[status]}
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
