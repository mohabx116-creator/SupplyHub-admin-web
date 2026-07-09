import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderStyle: 'dashed',
        background: 'rgba(255,255,255,0.72)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--brand-soft)',
              color: 'var(--brand)',
              fontWeight: 800,
            }}
          >
            SH
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          </Box>
          {actionLabel && actionHref ? <Button href={actionHref} variant="contained">{actionLabel}</Button> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
