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
import { getQuotationRoute } from '@/lib/routes/routes';
import { QuotationStatusChip } from './QuotationStatusChip';
import type { QuotationRecord } from '../quotations.types';

type QuotationsTableProps = {
  quotations: QuotationRecord[];
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

export function QuotationsTable({ quotations }: QuotationsTableProps) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{copy.quotations.columns.quotation}</TableCell>
              <TableCell>{copy.quotations.columns.supplier}</TableCell>
              <TableCell>{copy.quotations.columns.request}</TableCell>
              <TableCell>{copy.quotations.columns.status}</TableCell>
              <TableCell align="right">{copy.quotations.columns.total}</TableCell>
              <TableCell>{copy.quotations.columns.expiry}</TableCell>
              <TableCell>{copy.quotations.columns.updated}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map((quotation) => (
              <TableRow
                key={quotation.id}
                hover
                onClick={() => router.push(getQuotationRoute(quotation.id))}
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
                      {quotation.id.slice(0, 8).toUpperCase()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {quotation.currency}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {quotation.supplier.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {quotation.supplier.legalName ?? copy.shared.noData}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {quotation.request.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {quotation.request.company.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <QuotationStatusChip status={quotation.status} />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                >
                  {formatMoney(quotation.grandTotal, quotation.currency, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(quotation.validUntil, locale)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(quotation.updatedAt, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
