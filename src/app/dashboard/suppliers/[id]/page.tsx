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
import { SupplierActionsPanel } from '@/features/suppliers/components/SupplierActionsPanel';
import { SupplierStatusChip } from '@/features/suppliers/components/SupplierStatusChip';
import { SuppliersErrorState } from '@/features/suppliers/components/SuppliersErrorState';
import { getSupplierById } from '@/features/suppliers/suppliers.api';
import type { SupplierRecord } from '@/features/suppliers/suppliers.types';
import { routes } from '@/lib/routes/routes';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type SupplierDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value: string | null, locale: 'ar' | 'en') => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
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
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
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
          loadError instanceof Error ? loadError.message : copy.suppliers.errors.loadFailed,
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
  }, [copy.suppliers.errors.loadFailed, refreshTick, resolvedParams.id]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={copy.suppliers.detailTitle}
        description={copy.suppliers.detailDescription}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button href={routes.suppliers} variant="outlined">
              {copy.suppliers.backToSuppliers}
            </Button>
            <Button onClick={handleRefresh} variant="contained">
              {copy.shared.refresh}
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
          <SupplierActionsPanel
            context="detail"
            supplier={supplier}
            onMutationSuccess={handleRefresh}
          />

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      {copy.suppliers.detailTitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {supplier.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {supplier.legalName || copy.suppliers.noLegalName}
                    </Typography>
                  </Stack>
                  <SupplierStatusChip status={supplier.status} />
                </Stack>

                <Divider />
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.supplierIdLabel} value={supplier.id} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.categoryLabel} value={supplier.category ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.cityLabel} value={supplier.city ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.contactsLabel} value={String(supplier.contacts.length)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.emailLabel} value={supplier.email ?? '-'} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.suppliers.list.phoneLabel} value={supplier.phone ?? '-'} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.shared.createdAt} value={formatDate(supplier.createdAt, locale)} mono />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <Field label={copy.shared.updatedAt} value={formatDate(supplier.updatedAt, locale)} mono />
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
                      {copy.suppliers.contactDetails}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <Field label={copy.suppliers.list.contactWhatsAppLabel} value={supplier.whatsapp ?? '-'} mono />
                    <Field label={copy.suppliers.list.taxNumberLabel} value={supplier.taxNumber ?? '-'} mono />
                    <Field label={copy.suppliers.list.addressLabel} value={supplier.address ?? '-'} />
                    <Field
                      label={copy.suppliers.list.primaryLabel}
                      value={getPrimaryContact(supplier)?.name ?? copy.suppliers.list.noPrimaryContact}
                    />
                    <Field
                      label={copy.suppliers.list.contactRoleLabel}
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
                      {copy.suppliers.notesTitle}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    {supplier.notes ? (
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {supplier.notes}
                      </Typography>
                    ) : (
                      <Chip
                        label={copy.suppliers.noNotes}
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
                  {copy.suppliers.contactsRegistry}
                </Typography>
                {supplier.contacts.length > 0 ? (
                  <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{copy.suppliers.list.contactNameLabel}</TableCell>
                          <TableCell>{copy.suppliers.list.contactRoleLabel}</TableCell>
                          <TableCell>{copy.suppliers.list.contactPrimaryLabel}</TableCell>
                          <TableCell>{copy.suppliers.list.contactEmailLabel}</TableCell>
                          <TableCell>{copy.suppliers.list.contactPhoneLabel}</TableCell>
                          <TableCell>{copy.suppliers.list.contactWhatsAppLabel}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplier.contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <Stack spacing={0.25}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
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
                                  label={copy.suppliers.list.contactYes}
                                  size="small"
                                  color="success"
                                  sx={{ borderRadius: 0.5, height: 22, fontWeight: 700 }}
                                />
                              ) : (
                                copy.suppliers.list.contactNo
                              )}
                            </TableCell>
                            <TableCell>{contact.email ?? '-'}</TableCell>
                            <TableCell>{contact.phone ?? '-'}</TableCell>
                            <TableCell>{contact.whatsapp ?? '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Chip label={copy.suppliers.list.noPrimaryContact} variant="outlined" />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </Stack>
  );
}
