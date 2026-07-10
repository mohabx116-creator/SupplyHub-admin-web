import { Alert, Button, Stack, Typography } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type QuotationsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function QuotationsErrorState({ message, onRetry }: QuotationsErrorStateProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          {copy.shared.tryAgain}
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {copy.quotations.errors.loadFailed}
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Stack>
    </Alert>
  );
}
