'use client';

import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ApiError } from '@/lib/api/api-error';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';
import { createSupplier, updateSupplier, updateSupplierStatus } from '../suppliers.api';
import type { SupplierRecord, SupplierStatus, SupplierUpsertPayload } from '../suppliers.types';
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
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
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
      setFeedback({ type: 'success', message: copy.suppliers.list.createSuccess });
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
              : copy.suppliers.errors.createFailed,
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
      setFeedback({ type: 'success', message: copy.suppliers.list.updateSuccess });
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
              : copy.suppliers.errors.updateFailed,
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
        message: copy.suppliers.list.statusUpdated.replace('{status}', copy.suppliers.statuses[status]),
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
              : copy.suppliers.errors.statusFailed,
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
              {copy.suppliers.list.supplierActionsTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {copy.suppliers.list.actionSummary}
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
                {copy.suppliers.addSupplier}
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
                  {copy.suppliers.editSupplier}
                </Button>
                <Button
                  onClick={() => {
                    setStatusSession((value) => value + 1);
                    setStatusOpen(true);
                  }}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  {copy.suppliers.changeStatus}
                </Button>
              </>
            ) : null}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {copy.suppliers.list.mutationSummary}
          </Typography>
        </Stack>
      </CardContent>

      <SupplierFormDialog
        key={`create-${createSession}`}
        open={createOpen}
        mode="create"
        title={copy.suppliers.list.createTitle}
        description={copy.suppliers.list.createDescription}
        loading={isSubmitting}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <SupplierFormDialog
        key={`edit-${editSession}-${supplier?.id ?? 'none'}`}
        open={editOpen}
        mode="edit"
        title={copy.suppliers.list.editTitle}
        description={copy.suppliers.list.editDescription}
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
