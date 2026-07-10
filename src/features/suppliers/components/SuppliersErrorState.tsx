import { Alert, Button, Stack, Typography } from '@mui/material';

type SuppliersErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function SuppliersErrorState({
  message,
  onRetry,
}: SuppliersErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Unable to load suppliers.
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Stack>
    </Alert>
  );
}
