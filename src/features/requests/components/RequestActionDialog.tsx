'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import type { RequestStatus } from '../requests.types';

type RequestActionDialogProps = {
  open: boolean;
  title: string;
  description: string;
  targetStatus: RequestStatus;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function RequestActionDialog({
  open,
  title,
  description,
  targetStatus,
  confirmLabel,
  danger = false,
  loading = false,
  onClose,
  onConfirm,
}: RequestActionDialogProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {copy.requests.actions.targetStatus}: {copy.requests.requestStatuses[targetStatus]}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          {copy.shared.cancel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={danger ? 'error' : 'primary'}
        >
          {loading ? copy.requests.actions.applying : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
