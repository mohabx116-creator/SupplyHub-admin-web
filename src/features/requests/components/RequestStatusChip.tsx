import { Chip } from '@mui/material';
import type { RequestStatus } from '../requests.types';

const statusConfig: Record<
  RequestStatus,
  { label: string; bgcolor: string; color: string }
> = {
  NEW: { label: 'New', bgcolor: '#dbeafe', color: '#1e40af' },
  NEEDS_REVIEW: { label: 'Needs review', bgcolor: '#fef3c7', color: '#b45309' },
  NEEDS_CLARIFICATION: { label: 'Needs clarification', bgcolor: '#fef3c7', color: '#b45309' },
  READY_FOR_SOURCING: { label: 'Ready for sourcing', bgcolor: '#ffedd5', color: '#7c2d12' },
  SOURCING: { label: 'Sourcing', bgcolor: '#e0f2fe', color: '#0369a1' },
  SUPPLIER_QUOTES_RECEIVED: { label: 'Supplier quotes received', bgcolor: '#d1fae5', color: '#065f46' },
  CUSTOMER_QUOTE_SENT: { label: 'Customer quote sent', bgcolor: '#dbeafe', color: '#1e40af' },
  CUSTOMER_APPROVED: { label: 'Customer approved', bgcolor: '#d1fae5', color: '#065f46' },
  CUSTOMER_REJECTED: { label: 'Customer rejected', bgcolor: '#fee2e2', color: '#b91c1c' },
  CANCELLED: { label: 'Cancelled', bgcolor: '#f1f5f9', color: '#475569' },
  CONVERTED_TO_ORDER: { label: 'Converted to order', bgcolor: '#d1fae5', color: '#065f46' },
};

type RequestStatusChipProps = {
  status: RequestStatus;
};

export function RequestStatusChip({ status }: RequestStatusChipProps) {
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
