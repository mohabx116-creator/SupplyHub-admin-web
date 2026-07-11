'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { getDeliveryRoute } from '@/lib/routes/routes';
import { DeliveryStatusChip } from './DeliveryStatusChip';
import type { DeliveryMethod, DeliveryRecord } from '../deliveries.types';

type DeliveriesTableProps = {
  deliveries: DeliveryRecord[];
};

const formatDate = (value: string | null, locale: 'ar' | 'en') => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const getDeliveryMethodLabel = (locale: 'ar' | 'en', method: DeliveryMethod) => {
  const copy = getMessageBundle(locale);
  return copy.deliveries.methods[method];
};

export function DeliveriesTable({ deliveries }: DeliveriesTableProps) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{copy.deliveries.columns.delivery}</TableCell>
              <TableCell>{copy.deliveries.columns.order}</TableCell>
              <TableCell>{copy.deliveries.columns.company}</TableCell>
              <TableCell>{copy.deliveries.columns.status}</TableCell>
              <TableCell>{copy.deliveries.columns.method}</TableCell>
              <TableCell>{copy.deliveries.columns.trackingReference}</TableCell>
              <TableCell>{copy.deliveries.columns.scheduledAt}</TableCell>
              <TableCell>{copy.deliveries.columns.created}</TableCell>
              <TableCell>{copy.deliveries.columns.updated}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow
                key={delivery.id}
                hover
                onClick={() => router.push(getDeliveryRoute(delivery.id))}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: 'rgba(15, 23, 42, 0.02) !important',
                  },
                }}
              >
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {delivery.trackingReference ?? delivery.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {delivery.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {delivery.order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {delivery.order.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {delivery.company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {delivery.company.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <DeliveryStatusChip status={delivery.status} />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {getDeliveryMethodLabel(locale, delivery.method)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {delivery.trackingReference ?? copy.shared.noData}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(delivery.scheduledAt, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(delivery.createdAt, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(delivery.updatedAt, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
