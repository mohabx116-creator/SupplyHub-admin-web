'use client';

import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { ApiError } from '@/lib/api/api-error';
import { RequestActionDialog } from './RequestActionDialog';
import { updateRequestStatus } from '../requests.api';
import type { RequestActionKey, RequestStatus } from '../requests.types';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

type ActionConfig = {
  key: RequestActionKey;
  label: string;
  targetStatus: RequestStatus;
  description: string;
  confirmLabel: string;
  tone: 'primary' | 'secondary' | 'warning' | 'error';
  danger?: boolean;
};

const getActionsByStatus = (locale: 'ar' | 'en', currentStatus: RequestStatus) => {
  const copy = getMessageBundle(locale);
  const labels = copy.requests.actions;

  const liveActionsByStatus: Record<RequestStatus, ActionConfig[]> = {
    NEW: [
      {
        key: 'MARK_NEEDS_REVIEW',
        label: labels.markNeedsReview,
        targetStatus: 'NEEDS_REVIEW',
        description: labels.markNeedsReviewDescription,
        confirmLabel: labels.markNeedsReview,
        tone: 'secondary',
      },
      {
        key: 'REQUEST_CLARIFICATION',
        label: labels.requestClarification,
        targetStatus: 'NEEDS_CLARIFICATION',
        description: labels.requestClarificationDescription,
        confirmLabel: labels.requestClarification,
        tone: 'warning',
      },
      {
        key: 'MARK_READY_FOR_SOURCING',
        label: labels.markReadyForSourcing,
        targetStatus: 'READY_FOR_SOURCING',
        description: labels.markReadyForSourcingDescription,
        confirmLabel: labels.markReadyForSourcing,
        tone: 'primary',
      },
      {
        key: 'CANCEL_REQUEST',
        label: labels.cancelRequest,
        targetStatus: 'CANCELLED',
        description: labels.cancelRequestDescription,
        confirmLabel: labels.cancelRequest,
        tone: 'error',
        danger: true,
      },
    ],
    NEEDS_REVIEW: [
      {
        key: 'REQUEST_CLARIFICATION',
        label: labels.requestClarification,
        targetStatus: 'NEEDS_CLARIFICATION',
        description: labels.requestClarificationBeforeSourcingDescription,
        confirmLabel: labels.requestClarification,
        tone: 'warning',
      },
      {
        key: 'MARK_READY_FOR_SOURCING',
        label: labels.markReadyForSourcing,
        targetStatus: 'READY_FOR_SOURCING',
        description: labels.markReadyForSourcingDescription,
        confirmLabel: labels.markReadyForSourcing,
        tone: 'primary',
      },
      {
        key: 'CANCEL_REQUEST',
        label: labels.cancelRequest,
        targetStatus: 'CANCELLED',
        description: labels.cancelRequestDescription,
        confirmLabel: labels.cancelRequest,
        tone: 'error',
        danger: true,
      },
    ],
    NEEDS_CLARIFICATION: [
      {
        key: 'MARK_NEEDS_REVIEW',
        label: labels.markNeedsReview,
        targetStatus: 'NEEDS_REVIEW',
        description: labels.moveBackToReviewDescription,
        confirmLabel: labels.markNeedsReview,
        tone: 'secondary',
      },
      {
        key: 'MARK_READY_FOR_SOURCING',
        label: labels.markReadyForSourcing,
        targetStatus: 'READY_FOR_SOURCING',
        description: labels.proceedAfterClarificationDescription,
        confirmLabel: labels.markReadyForSourcing,
        tone: 'primary',
      },
      {
        key: 'CANCEL_REQUEST',
        label: labels.cancelRequest,
        targetStatus: 'CANCELLED',
        description: labels.cancelRequestDescription,
        confirmLabel: labels.cancelRequest,
        tone: 'error',
        danger: true,
      },
    ],
    READY_FOR_SOURCING: [
      {
        key: 'START_SOURCING',
        label: labels.startSourcing,
        targetStatus: 'SOURCING',
        description: labels.startSourcingDescription,
        confirmLabel: labels.startSourcing,
        tone: 'primary',
      },
      {
        key: 'CANCEL_REQUEST',
        label: labels.cancelRequest,
        targetStatus: 'CANCELLED',
        description:
          locale === 'ar'
            ? 'ألغِ الطلب من مسار الإدارة الحالي.'
            : 'Cancel this request from the admin workflow.',
        confirmLabel: labels.cancelRequest,
        tone: 'error',
        danger: true,
      },
    ],
    SOURCING: [],
    SUPPLIER_QUOTES_RECEIVED: [],
    CUSTOMER_QUOTE_SENT: [],
    CUSTOMER_APPROVED: [],
    CUSTOMER_REJECTED: [],
    CANCELLED: [],
    CONVERTED_TO_ORDER: [],
  };

  return liveActionsByStatus[currentStatus] ?? [];
};

const toneColor: Record<ActionConfig['tone'], 'primary' | 'secondary' | 'warning' | 'error'> = {
  primary: 'primary',
  secondary: 'secondary',
  warning: 'warning',
  error: 'error',
};

type RequestActionsPanelProps = {
  requestId: string;
  currentStatus: RequestStatus;
  onActionSuccess: () => void;
};

export function RequestActionsPanel({
  requestId,
  currentStatus,
  onActionSuccess,
}: RequestActionsPanelProps) {
  const locale = useLocaleStore((state) => state.locale);
  const copy = getMessageBundle(locale);
  const [activeAction, setActiveAction] = useState<ActionConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const availableActions = useMemo(
    () => getActionsByStatus(locale, currentStatus),
    [currentStatus, locale],
  );

  const actionSummary = useMemo(() => {
    if (availableActions.length === 0) {
      return copy.requests.noLiveActions;
    }

    return `${copy.requests.liveTransitions}: ${copy.requests.requestStatuses[currentStatus]}`;
  }, [availableActions.length, copy.requests.liveTransitions, copy.requests.noLiveActions, copy.requests.requestStatuses, currentStatus]);

  const handleSubmit = async () => {
    if (!activeAction) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await updateRequestStatus(requestId, {
        status: activeAction.targetStatus,
      });
      setFeedback({
        type: 'success',
        message: copy.requests.actions.updateSuccess,
      });
      setActiveAction(null);
      onActionSuccess();
    } catch (actionError) {
      const message =
        actionError instanceof ApiError
          ? actionError.message
          : actionError instanceof Error
            ? actionError.message
            : copy.requests.errors.actionsFailed;
      setFeedback({
        type: 'error',
        message,
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
              {copy.requests.requestActions}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {actionSummary}
            </Typography>
          </Box>

          {feedback ? (
            <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
              {feedback.message}
            </Alert>
          ) : null}

          <Stack spacing={1.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {copy.requests.liveTransitions}
            </Typography>
            {availableActions.length > 0 ? (
              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                {availableActions.map((action) => (
                  <Button
                    key={action.key}
                    onClick={() => setActiveAction(action)}
                    variant={action.tone === 'primary' ? 'contained' : 'outlined'}
                    color={toneColor[action.tone]}
                    disabled={isSubmitting}
                    sx={{ borderRadius: 999 }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {copy.requests.noLiveActions}
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {copy.requests.plannedActions}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label={copy.requests.plannedConvert}
                variant="outlined"
                disabled
                sx={{
                  borderRadius: 999,
                  opacity: 0.7,
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {copy.requests.plannedConvertNote}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      {activeAction ? (
        <RequestActionDialog
          open
          title={activeAction.label}
          description={activeAction.description}
          targetStatus={activeAction.targetStatus}
          confirmLabel={activeAction.confirmLabel}
          danger={activeAction.danger}
          loading={isSubmitting}
          onClose={() => setActiveAction(null)}
          onConfirm={() => void handleSubmit()}
        />
      ) : null}
    </Card>
  );
}
