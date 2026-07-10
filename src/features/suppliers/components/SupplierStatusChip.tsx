import { Chip } from '@mui/material';
import type { SupplierStatus } from '../suppliers.types';

const statusConfig: Record<
  SupplierStatus,
  { label: string; bgcolor: string; color: string }
> = {
  ACTIVE: { label: 'Active', bgcolor: '#d1fae5', color: '#065f46' },
  INACTIVE: { label: 'Inactive', bgcolor: '#f1f5f9', color: '#475569' },
  BLACKLISTED: { label: 'Blacklisted', bgcolor: '#fee2e2', color: '#b91c1c' },
};

type SupplierStatusChipProps = {
  status: SupplierStatus;
};

export function SupplierStatusChip({ status }: SupplierStatusChipProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        fontWeight: 700,
        bgcolor: config.bgcolor,
        color: config.color,
        borderRadius: 0.5,
        height: 22,
        fontSize: '0.75rem',
      }}
    />
  );
}
