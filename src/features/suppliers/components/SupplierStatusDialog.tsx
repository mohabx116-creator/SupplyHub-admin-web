'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { supplierStatuses, type SupplierStatus } from '../suppliers.types';

type SupplierStatusDialogProps = {
  open: boolean;
  currentStatus: SupplierStatus;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (status: SupplierStatus) => Promise<void>;
};

export function SupplierStatusDialog({
  open,
  currentStatus,
  loading = false,
  onClose,
  onConfirm,
}: SupplierStatusDialogProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [nextStatus, setNextStatus] = useState<SupplierStatus>(currentStatus);

  const danger = nextStatus === 'BLACKLISTED';

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{copy.suppliers.list.statusDialogTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {copy.suppliers.list.statusDialogDescription}
          </Typography>
          <TextField
            select
            label={copy.suppliers.list.targetStatusLabel}
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value as SupplierStatus)}
            fullWidth
          >
            {supplierStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {copy.suppliers.statuses[status]}
              </MenuItem>
            ))}
          </TextField>
          {danger ? (
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
              {copy.suppliers.list.blacklistWarning}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          {copy.shared.cancel}
        </Button>
        <Button
          onClick={() => void onConfirm(nextStatus)}
          disabled={loading || nextStatus === currentStatus}
          variant="contained"
          color={danger ? 'error' : 'primary'}
        >
          {loading ? copy.suppliers.list.updating : danger ? copy.suppliers.list.blacklistSupplier : copy.suppliers.list.updateStatus}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
