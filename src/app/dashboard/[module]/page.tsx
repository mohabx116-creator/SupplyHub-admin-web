import { notFound } from 'next/navigation';
import { Box, Button, Stack, Typography } from '@mui/material';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getModuleBySlug, routes } from '@/lib/routes/routes';

type ModulePageProps = {
  params: {
    module: string;
  };
};

export default async function ModulePlaceholderPage({
  params,
}: ModulePageProps) {
  const { module } = params;
  const current = getModuleBySlug(module);

  if (!current) {
    notFound();
  }

  return (
    <Stack spacing={4}>
      <PageHeader
        title={current.label}
        description={current.description}
        actions={
          <Button href={routes.dashboard} variant="outlined">
            Back to dashboard
          </Button>
        }
      />
      <EmptyState
        title="Module placeholder"
        description="This route is reserved for the next phase, where the live admin module will be implemented."
        actionLabel="Back to dashboard"
        actionHref={routes.dashboard}
      />
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Current state
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Foundation only. No backend mutation calls are wired yet.
        </Typography>
      </Box>
    </Stack>
  );
}
