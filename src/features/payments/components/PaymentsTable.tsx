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
import { getPaymentRoute } from '@/lib/routes/routes';
import { PaymentStatusChip } from './PaymentStatusChip';
import type { PaymentRecord, PaymentMethod } from '../payments.types';

type PaymentsTableProps = {
  payments: PaymentRecord[];
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

const formatMoney = (value: string, currency: string, locale: 'ar' | 'en') => {
  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(numeric);
    } catch {
      return `${numeric.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 2,
      })} ${currency}`;
    }
  }

  return `${value} ${currency}`;
};

const getPaymentMethodLabel = (locale: 'ar' | 'en', method: PaymentMethod) => {
  const copy = getMessageBundle(locale);
  return copy.payments.methods[method];
};

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{copy.payments.columns.payment}</TableCell>
              <TableCell>{copy.payments.columns.order}</TableCell>
              <TableCell>{copy.payments.columns.company}</TableCell>
              <TableCell>{copy.payments.columns.status}</TableCell>
              <TableCell>{copy.payments.columns.method}</TableCell>
              <TableCell align="right">{copy.payments.columns.amount}</TableCell>
              <TableCell align="right">{copy.payments.columns.outstandingAmount}</TableCell>
              <TableCell>{copy.payments.columns.paidAt}</TableCell>
              <TableCell>{copy.payments.columns.updated}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                hover
                onClick={() => router.push(getPaymentRoute(payment.id))}
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
                      {payment.reference ?? payment.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {payment.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {payment.order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.order.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {payment.company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.company.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <PaymentStatusChip status={payment.status} />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {getPaymentMethodLabel(locale, payment.method)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                >
                  {formatMoney(payment.amount, payment.currency, locale)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                >
                  {formatMoney(payment.outstandingAmount, payment.currency, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(payment.paidAt, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(payment.updatedAt, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
