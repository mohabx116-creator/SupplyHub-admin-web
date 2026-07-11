'use client';

import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type InvoicesEmptyStateProps = {
  onRefresh: () => void;
};

export function InvoicesEmptyState({ onRefresh }: InvoicesEmptyStateProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ border: '1px dashed #cbd5e1', bgcolor: '#f8fafc' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {copy.invoices.noInvoicesTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            {copy.invoices.noInvoicesDescription}
          </Typography>
          <Button onClick={onRefresh} variant="contained">
            {copy.shared.refresh}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
