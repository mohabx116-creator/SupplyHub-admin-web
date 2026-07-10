import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type QuotationsEmptyStateProps = {
  onRefresh: () => void;
  variant?: 'requests' | 'quotations';
};

export function QuotationsEmptyState({
  onRefresh,
  variant = 'quotations',
}: QuotationsEmptyStateProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const content =
    variant === 'requests'
      ? {
          title: copy.quotations.noRequestsTitle,
          description: copy.quotations.noRequestsDescription,
        }
      : {
          title: copy.quotations.noQuotationsTitle,
          description: copy.quotations.noQuotationsDescription,
        };

  return (
    <Card sx={{ border: '1px dashed #cbd5e1', bgcolor: '#f8fafc' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {content.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            {content.description}
          </Typography>
          <Button onClick={onRefresh} variant="contained">
            {copy.shared.refresh}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
