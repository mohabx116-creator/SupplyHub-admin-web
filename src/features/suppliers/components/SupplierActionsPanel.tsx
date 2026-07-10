'use client';

import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ApiError } from '@/lib/api/api-error';
import { createSupplier, updateSupplier, updateSupplierStatus } from '../suppliers.api';
import type {
  SupplierRecord,
  SupplierStatus,
  SupplierUpsertPayload,
} from '../suppliers.types';
import { SupplierFormDialog } from './SupplierFormDialog';
import { SupplierStatusDialog } from './SupplierStatusDialog';

type SupplierActionsPanelProps = {
  supplier?: SupplierRecord | null;
  onMutationSuccess: () => void;
  context: 'list' | 'detail';
};

export function SupplierActionsPanel({
  supplier = null,
  onMutationSuccess,
  context,
}: SupplierActionsPanelProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [createSession, setCreateSession] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusSession, setStatusSession] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleCreate = async (payload: SupplierUpsertPayload) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await createSupplier(payload);
      setFeedback({
        type: 'success',
        message: 'Supplier created successfully.',
      });
      setCreateOpen(false);
      onMutationSuccess();
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message:
          mutationError instanceof ApiError
            ? mutationError.message
            : mutationError instanceof Error
              ? mutationError.message
              : 'Unable to create supplier.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: SupplierUpsertPayload) => {
    if (!supplier) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await updateSupplier(supplier.id, payload);
      setFeedback({
        type: 'success',
        message: 'Supplier updated successfully.',
      });
      setEditOpen(false);
      onMutationSuccess();
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message:
          mutationError instanceof ApiError
            ? mutationError.message
            : mutationError instanceof Error
              ? mutationError.message
              : 'Unable to update supplier.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: SupplierStatus) => {
    if (!supplier) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await updateSupplierStatus(supplier.id, { status });
      setFeedback({
        type: 'success',
        message: `Supplier status updated to ${status}.`,
      });
      setStatusOpen(false);
      onMutationSuccess();
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message:
          mutationError instanceof ApiError
            ? mutationError.message
            : mutationError instanceof Error
              ? mutationError.message
              : 'Unable to update supplier status.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Supplier Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Create, edit, and status actions are backed by the live admin API.
            </Typography>
          </Box>

          {feedback ? (
            <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
              {feedback.message}
            </Alert>
          ) : null}

          <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
            {context === 'list' ? (
              <Button
                onClick={() => {
                  setCreateSession((value) => value + 1);
                  setCreateOpen(true);
                }}
                variant="contained"
                disabled={isSubmitting}
              >
                Add Supplier
              </Button>
            ) : null}
            {supplier ? (
              <>
                <Button
                  onClick={() => {
                    setEditSession((value) => value + 1);
                    setEditOpen(true);
                  }}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Edit Supplier
                </Button>
                <Button
                  onClick={() => {
                    setStatusSession((value) => value + 1);
                    setStatusOpen(true);
                  }}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Change Status
                </Button>
              </>
            ) : null}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Mutations are submitted only after backend success, and the list/detail views refresh automatically.
          </Typography>
        </Stack>
      </CardContent>

      <SupplierFormDialog
        key={`create-${createSession}`}
        open={createOpen}
        mode="create"
        title="Add Supplier"
        description="Create a new supplier record using the backend-supported supplier fields and contacts payload."
        loading={isSubmitting}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <SupplierFormDialog
        key={`edit-${editSession}-${supplier?.id ?? 'none'}`}
        open={editOpen}
        mode="edit"
        title="Edit Supplier"
        description="Update the supplier's basic details and contacts using the live admin API."
        initialSupplier={supplier}
        loading={isSubmitting}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      {supplier ? (
        <SupplierStatusDialog
          key={`status-${statusSession}-${supplier.id}`}
          open={statusOpen}
          currentStatus={supplier.status}
          loading={isSubmitting}
          onClose={() => setStatusOpen(false)}
          onConfirm={handleStatusChange}
        />
      ) : null}
    </Card>
  );
}
