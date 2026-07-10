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
import { getSupplierRoute } from '@/lib/routes/routes';
import { SupplierStatusChip } from './SupplierStatusChip';
import type { SupplierRecord } from '../suppliers.types';

type SuppliersTableProps = {
  suppliers: SupplierRecord[];
};

const formatDate = (value: string, locale: 'ar' | 'en') =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

const getPrimaryContact = (supplier: SupplierRecord) =>
  supplier.contacts.find((contact) => contact.isPrimary) ?? supplier.contacts[0];

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{copy.suppliers.list.supplierLabel}</TableCell>
              <TableCell>{copy.shared.status}</TableCell>
              <TableCell>{copy.suppliers.list.categoryLabel}</TableCell>
              <TableCell>{copy.suppliers.list.contactDetails}</TableCell>
              <TableCell align="right">{copy.suppliers.list.contactsLabel}</TableCell>
              <TableCell>{copy.suppliers.list.cityLabel}</TableCell>
              <TableCell>{copy.suppliers.list.updatedLabel}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => {
              const primaryContact = getPrimaryContact(supplier);

              return (
                <TableRow
                  key={supplier.id}
                  hover
                  onClick={() => router.push(getSupplierRoute(supplier.id))}
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
                        {supplier.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          color: 'text.secondary',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {shortId(supplier.id)}
                      </Typography>
                      {supplier.legalName ? (
                        <Typography variant="caption" color="text.secondary">
                          {supplier.legalName}
                        </Typography>
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <SupplierStatusChip status={supplier.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {supplier.category ?? copy.shared.noData}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {primaryContact?.name ?? copy.suppliers.list.noPrimaryContact}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {primaryContact?.role ?? copy.suppliers.list.primaryContactMissing}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}
                  >
                    {supplier.contacts.length}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#0f172a' }}>
                      {supplier.city ?? copy.shared.noData}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                    {formatDate(supplier.updatedAt, locale)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
