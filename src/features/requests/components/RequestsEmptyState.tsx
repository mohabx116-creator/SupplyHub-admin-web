import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

type RequestsEmptyStateProps = {
  onRefresh: () => void;
};

export function RequestsEmptyState({ onRefresh }: RequestsEmptyStateProps) {
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
            No requests yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The authenticated admin feed is working, but this environment does
            not currently have any procurement requests to display.
          </Typography>
          <Button onClick={onRefresh} variant="contained">
            Refresh
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
