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
import { getInvoiceRoute } from '@/lib/routes/routes';
import { InvoiceStatusChip } from './InvoiceStatusChip';
import type { InvoiceRecord, InvoiceType } from '../invoices.types';

type InvoicesTableProps = {
  invoices: InvoiceRecord[];
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

const getInvoiceTypeLabel = (locale: 'ar' | 'en', type: InvoiceType) => {
  const copy = getMessageBundle(locale);
  return copy.invoices.types[type];
};

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{copy.invoices.columns.invoice}</TableCell>
              <TableCell>{copy.invoices.columns.order}</TableCell>
              <TableCell>{copy.invoices.columns.company}</TableCell>
              <TableCell>{copy.invoices.columns.status}</TableCell>
              <TableCell>{copy.invoices.columns.type}</TableCell>
              <TableCell align="right">{copy.invoices.columns.total}</TableCell>
              <TableCell align="right">{copy.invoices.columns.outstandingAmount}</TableCell>
              <TableCell>{copy.invoices.columns.issuedAt}</TableCell>
              <TableCell>{copy.invoices.columns.dueAt}</TableCell>
              <TableCell>{copy.invoices.columns.updated}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                hover
                onClick={() => router.push(getInvoiceRoute(invoice.id))}
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
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {invoice.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {invoice.order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invoice.order.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {invoice.company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invoice.company.id}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <InvoiceStatusChip status={invoice.status} />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {getInvoiceTypeLabel(locale, invoice.type)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                >
                  {formatMoney(invoice.grandTotal, invoice.currency, locale)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                >
                  {formatMoney(invoice.outstandingAmount, invoice.currency, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(invoice.issuedAt, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(invoice.dueAt, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(invoice.updatedAt, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
