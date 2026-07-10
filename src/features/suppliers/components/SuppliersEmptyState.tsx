import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

type SuppliersEmptyStateProps = {
  onRefresh: () => void;
};

export function SuppliersEmptyState({ onRefresh }: SuppliersEmptyStateProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderStyle: 'dashed',
        background: 'rgba(255,255,255,0.76)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No suppliers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The admin supplier API is reachable, but no supplier records match the current filters.
          </Typography>
          <Button onClick={onRefresh} variant="contained">
            Refresh
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
