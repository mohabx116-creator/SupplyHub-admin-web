'use client';

import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type DeliveriesEmptyStateProps = {
  onRefresh: () => void;
};

export function DeliveriesEmptyState({ onRefresh }: DeliveriesEmptyStateProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Card sx={{ border: '1px dashed #cbd5e1', bgcolor: '#f8fafc' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {copy.deliveries.noDeliveriesTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            {copy.deliveries.noDeliveriesDescription}
          </Typography>
          <Button onClick={onRefresh} variant="contained">
            {copy.shared.refresh}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
