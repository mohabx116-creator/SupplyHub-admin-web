import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function DeliveriesLoadingState() {
  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={0}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              sx={{ px: 3, py: 2.25, borderBottom: '1px solid var(--border)' }}
            >
              <Skeleton variant="text" width="24%" height={28} />
              <Skeleton variant="text" width="20%" height={28} />
              <Skeleton variant="text" width="16%" height={28} />
              <Skeleton variant="rounded" width={112} height={28} />
              <Skeleton variant="text" width="14%" height={28} />
              <Skeleton variant="text" width="18%" height={28} />
              <Skeleton variant="text" width="18%" height={28} />
              <Skeleton variant="text" width="12%" height={28} />
              <Skeleton variant="text" width="12%" height={28} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
