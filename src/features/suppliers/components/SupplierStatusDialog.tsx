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
import { supplierStatuses, type SupplierStatus } from '../suppliers.types';

type SupplierStatusDialogProps = {
  open: boolean;
  currentStatus: SupplierStatus;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (status: SupplierStatus) => Promise<void>;
};

const statusLabel: Record<SupplierStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLACKLISTED: 'Blacklisted',
};

export function SupplierStatusDialog({
  open,
  currentStatus,
  loading = false,
  onClose,
  onConfirm,
}: SupplierStatusDialogProps) {
  const [nextStatus, setNextStatus] = useState<SupplierStatus>(currentStatus);

  const danger = nextStatus === 'BLACKLISTED';

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Change supplier status</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Choose the next supplier status and confirm the change. Status updates are sent to the backend only after confirmation.
          </Typography>
          <TextField
            select
            label="Target status"
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value as SupplierStatus)}
            fullWidth
          >
            {supplierStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabel[status]}
              </MenuItem>
            ))}
          </TextField>
          {danger ? (
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
              Blacklisting a supplier should be reserved for serious quality, compliance, or fraud concerns.
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => void onConfirm(nextStatus)}
          disabled={loading || nextStatus === currentStatus}
          variant="contained"
          color={danger ? 'error' : 'primary'}
        >
          {loading ? 'Updating...' : danger ? 'Blacklist supplier' : 'Update status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
