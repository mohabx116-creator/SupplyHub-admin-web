import { Chip } from '@mui/material';
import type { RequestStatus } from '../requests.types';

const statusConfig: Record<
  RequestStatus,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' }
> = {
  NEW: { label: 'New', color: 'info' },
  NEEDS_REVIEW: { label: 'Needs review', color: 'warning' },
  NEEDS_CLARIFICATION: { label: 'Needs clarification', color: 'warning' },
  READY_FOR_SOURCING: { label: 'Ready for sourcing', color: 'secondary' },
  SOURCING: { label: 'Sourcing', color: 'primary' },
  SUPPLIER_QUOTES_RECEIVED: { label: 'Supplier quotes received', color: 'success' },
  CUSTOMER_QUOTE_SENT: { label: 'Customer quote sent', color: 'info' },
  CUSTOMER_APPROVED: { label: 'Customer approved', color: 'success' },
  CUSTOMER_REJECTED: { label: 'Customer rejected', color: 'error' },
  CANCELLED: { label: 'Cancelled', color: 'default' },
  CONVERTED_TO_ORDER: { label: 'Converted to order', color: 'success' },
};

type RequestStatusChipProps = {
  status: RequestStatus;
};

export function RequestStatusChip({ status }: RequestStatusChipProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
