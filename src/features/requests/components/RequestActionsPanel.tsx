'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { ApiError } from '@/lib/api/api-error';
import { RequestActionDialog } from './RequestActionDialog';
import { updateRequestStatus } from '../requests.api';
import type { RequestActionKey, RequestStatus } from '../requests.types';

type ActionConfig = {
  key: RequestActionKey;
  label: string;
  targetStatus: RequestStatus;
  description: string;
  confirmLabel: string;
  tone: 'primary' | 'secondary' | 'warning' | 'error';
  danger?: boolean;
};

const liveActionsByStatus: Record<RequestStatus, ActionConfig[]> = {
  NEW: [
    {
      key: 'MARK_NEEDS_REVIEW',
      label: 'Mark needs review',
      targetStatus: 'NEEDS_REVIEW',
      description: 'Move this request into the review queue.',
      confirmLabel: 'Mark needs review',
      tone: 'secondary',
    },
    {
      key: 'REQUEST_CLARIFICATION',
      label: 'Request clarification',
      targetStatus: 'NEEDS_CLARIFICATION',
      description: 'Ask the customer team to clarify missing details.',
      confirmLabel: 'Request clarification',
      tone: 'warning',
    },
    {
      key: 'MARK_READY_FOR_SOURCING',
      label: 'Mark ready for sourcing',
      targetStatus: 'READY_FOR_SOURCING',
      description: 'Push the request forward for supplier sourcing.',
      confirmLabel: 'Mark ready for sourcing',
      tone: 'primary',
    },
    {
      key: 'CANCEL_REQUEST',
      label: 'Cancel request',
      targetStatus: 'CANCELLED',
      description: 'Cancel this request from the admin workflow.',
      confirmLabel: 'Cancel request',
      tone: 'error',
      danger: true,
    },
  ],
  NEEDS_REVIEW: [
    {
      key: 'REQUEST_CLARIFICATION',
      label: 'Request clarification',
      targetStatus: 'NEEDS_CLARIFICATION',
      description: 'Ask for the missing information before sourcing.',
      confirmLabel: 'Request clarification',
      tone: 'warning',
    },
    {
      key: 'MARK_READY_FOR_SOURCING',
      label: 'Mark ready for sourcing',
      targetStatus: 'READY_FOR_SOURCING',
      description: 'Move this request into sourcing readiness.',
      confirmLabel: 'Mark ready for sourcing',
      tone: 'primary',
    },
    {
      key: 'CANCEL_REQUEST',
      label: 'Cancel request',
      targetStatus: 'CANCELLED',
      description: 'Cancel this request from the admin workflow.',
      confirmLabel: 'Cancel request',
      tone: 'error',
      danger: true,
    },
  ],
  NEEDS_CLARIFICATION: [
    {
      key: 'MARK_NEEDS_REVIEW',
      label: 'Mark needs review',
      targetStatus: 'NEEDS_REVIEW',
      description: 'Move the request back to the review queue.',
      confirmLabel: 'Mark needs review',
      tone: 'secondary',
    },
    {
      key: 'MARK_READY_FOR_SOURCING',
      label: 'Mark ready for sourcing',
      targetStatus: 'READY_FOR_SOURCING',
      description: 'Proceed once the missing details are resolved.',
      confirmLabel: 'Mark ready for sourcing',
      tone: 'primary',
    },
    {
      key: 'CANCEL_REQUEST',
      label: 'Cancel request',
      targetStatus: 'CANCELLED',
      description: 'Cancel this request from the admin workflow.',
      confirmLabel: 'Cancel request',
      tone: 'error',
      danger: true,
    },
  ],
  READY_FOR_SOURCING: [
    {
      key: 'START_SOURCING',
      label: 'Start sourcing',
      targetStatus: 'SOURCING',
      description: 'Move the request into active supplier sourcing.',
      confirmLabel: 'Start sourcing',
      tone: 'primary',
    },
    {
      key: 'CANCEL_REQUEST',
      label: 'Cancel request',
      targetStatus: 'CANCELLED',
      description: 'Cancel this request from the admin workflow.',
      confirmLabel: 'Cancel request',
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

const plannedActions = [
  'Convert to order',
] as const;

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
  const [activeAction, setActiveAction] = useState<ActionConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const availableActions = useMemo(
    () => liveActionsByStatus[currentStatus] ?? [],
    [currentStatus],
  );

  const actionSummary = useMemo(() => {
    if (availableActions.length === 0) {
      return 'No live status transitions are available for this request state yet.';
    }

    return `Available transitions from ${currentStatus}.`;
  }, [availableActions.length, currentStatus]);

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
        message: `Request updated to ${activeAction.targetStatus}.`,
      });
      setActiveAction(null);
      onActionSuccess();
    } catch (actionError) {
      const message =
        actionError instanceof ApiError
          ? actionError.message
          : actionError instanceof Error
            ? actionError.message
            : 'Unable to update request status.';
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
              Request Actions
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
              Live status transitions
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
                No live status actions are available for this status yet.
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Planned actions
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {plannedActions.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  variant="outlined"
                  disabled
                  sx={{
                    borderRadius: 999,
                    opacity: 0.7,
                  }}
                />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Convert to order is not exposed in the current API contract yet.
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
