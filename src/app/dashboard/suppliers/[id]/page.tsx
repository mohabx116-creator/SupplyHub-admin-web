'use client';

import { use, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PageHeader } from '@/components/ui/PageHeader';
import { SupplierStatusChip } from '@/features/suppliers/components/SupplierStatusChip';
import { SuppliersErrorState } from '@/features/suppliers/components/SuppliersErrorState';
import { getSupplierById } from '@/features/suppliers/suppliers.api';
import type { SupplierRecord } from '@/features/suppliers/suppliers.types';
import { routes } from '@/lib/routes/routes';

type SupplierDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const Field = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <Stack spacing={0.5}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        color: '#0f172a',
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.03em' : 'inherit',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const getPrimaryContact = (supplier: SupplierRecord) =>
  supplier.contacts.find((contact) => contact.isPrimary) ?? supplier.contacts[0];

export default function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  const resolvedParams = use(params);
  const [supplier, setSupplier] = useState<SupplierRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;

    const loadSupplier = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getSupplierById(resolvedParams.id);

        if (!active) {
          return;
        }

        setSupplier(data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setSupplier(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load supplier details right now.',
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadSupplier();

    return () => {
      active = false;
    };
  }, [resolvedParams.id, refreshTick]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Supplier details"
        description="Review the supplier record, contact roster, and operational metadata from the admin API."
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.suppliers} variant="outlined">
              Back to Suppliers
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              Refresh
            </Button>
          </Stack>
        }
      />

      {error ? <SuppliersErrorState message={error} onRetry={handleRefresh} /> : null}

      {isLoading ? (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="28%" height={44} />
              <Skeleton variant="rounded" width="100%" height={160} />
              <Skeleton variant="rounded" width="100%" height={240} />
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && supplier ? (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      Supplier
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {supplier.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {supplier.legalName || 'No legal name provided.'}
                    </Typography>
                  </Stack>
                  <SupplierStatusChip status={supplier.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Supplier ID" value={supplier.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Category" value={supplier.category ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="City" value={supplier.city ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Contacts" value={String(supplier.contacts.length)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Email" value={supplier.email ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Phone" value={supplier.phone ?? '-'} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Created" value={formatDate(supplier.createdAt)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label="Updated" value={formatDate(supplier.updatedAt)} mono />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Contact Details
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Field label="WhatsApp" value={supplier.whatsapp ?? '-'} mono />
                    <Field label="Tax number" value={supplier.taxNumber ?? '-'} mono />
                    <Field label="Address" value={supplier.address ?? '-'} />
                    <Field
                      label="Primary contact"
                      value={getPrimaryContact(supplier)?.name ?? 'No contacts on file'}
                    />
                    <Field
                      label="Primary contact role"
                      value={getPrimaryContact(supplier)?.role ?? '-'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ height: '100%', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Supplier Notes
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    {supplier.notes ? (
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {supplier.notes}
                      </Typography>
                    ) : (
                      <Chip
                        label="No internal notes"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start', borderRadius: 999 }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Contacts Registry
                </Typography>
                {supplier.contacts.length > 0 ? (
                  <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Primary</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>WhatsApp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplier.contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <Stack spacing={0.25}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 700, color: '#0f172a' }}
                                >
                                  {contact.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                                >
                                  {contact.id}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{contact.role ?? '-'}</TableCell>
                            <TableCell>
                              {contact.isPrimary ? (
                                <Chip
                                  label="Primary"
                                  size="small"
                                  color="success"
                                  sx={{ borderRadius: 0.5, height: 22, fontWeight: 700 }}
                                />
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>{contact.email ?? '-'}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>
                              {contact.phone ?? '-'}
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>
                              {contact.whatsapp ?? '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No supplier contacts are stored for this record.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </Stack>
  );
}
