import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function PaymentsLoadingState() {
  return (
    <Card sx={{ border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="30%" height={44} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={320} />
        </Stack>
      </CardContent>
    </Card>
  );
}
