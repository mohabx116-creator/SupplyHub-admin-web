import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function RequestsLoadingState() {
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={0}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              sx={{ px: 3, py: 2.25, borderBottom: '1px solid var(--border)' }}
            >
              <Skeleton variant="text" width="28%" height={28} />
              <Skeleton variant="rounded" width={112} height={28} />
              <Skeleton variant="text" width="18%" height={28} />
              <Skeleton variant="text" width="18%" height={28} />
              <Skeleton variant="text" width={52} height={28} />
              <Skeleton variant="text" width="12%" height={28} />
              <Skeleton variant="text" width="12%" height={28} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
