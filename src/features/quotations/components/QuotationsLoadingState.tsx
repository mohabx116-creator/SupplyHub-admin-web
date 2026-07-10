import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function QuotationsLoadingState() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="32%" height={44} />
          <Skeleton variant="rounded" width="100%" height={96} />
          <Skeleton variant="rounded" width="100%" height={320} />
        </Stack>
      </CardContent>
    </Card>
  );
}
