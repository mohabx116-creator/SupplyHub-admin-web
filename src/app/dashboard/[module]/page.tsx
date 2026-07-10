'use client';

import { use } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { getModuleBySlug, routes } from '@/lib/routes/routes';

type ModulePageProps = {
  params: Promise<{
    module: string;
  }>;
};

export default function ModulePlaceholderPage({ params }: ModulePageProps) {
  const resolved = use(params);
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const current = getModuleBySlug(resolved.module);

  if (!current) {
    return null;
  }

  const moduleCopy = copy.dashboard.moduleCatalog[current.slug as keyof typeof copy.dashboard.moduleCatalog];

  return (
    <Stack spacing={4}>
      <PageHeader
        title={moduleCopy.label}
        description={moduleCopy.description}
        actions={
          <Button href={routes.dashboard} variant="outlined">
            {copy.modulePlaceholder.backToDashboard}
          </Button>
        }
      />
      <EmptyState
        title={copy.modulePlaceholder.title}
        description={copy.modulePlaceholder.description}
        actionLabel={copy.modulePlaceholder.backToDashboard}
        actionHref={routes.dashboard}
      />
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {copy.modulePlaceholder.currentStateTitle}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {copy.modulePlaceholder.currentStateValue}
        </Typography>
      </Box>
    </Stack>
  );
}
