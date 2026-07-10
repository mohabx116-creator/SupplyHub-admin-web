# Admin Requests Actions Foundation

## Purpose
This document records the first action layer for the SupplyHub admin Requests module. The goal of this phase was to expose the real backend status transition contract in the admin UI without inventing unsupported mutations.

## Backend Contract Confirmed
- `GET /api/admin/requests`
- `GET /api/admin/requests/:id`
- `PATCH /api/admin/requests/:id/status`
- `PATCH /api/admin/requests/:id/internal-notes`

### Status Update Payload
- Request body: `{ status }`

### Allowed Status Transitions
- `NEW` -> `NEEDS_REVIEW`, `NEEDS_CLARIFICATION`, `READY_FOR_SOURCING`, `CANCELLED`
- `NEEDS_REVIEW` -> `NEEDS_CLARIFICATION`, `READY_FOR_SOURCING`, `CANCELLED`
- `NEEDS_CLARIFICATION` -> `NEEDS_REVIEW`, `READY_FOR_SOURCING`, `CANCELLED`
- `READY_FOR_SOURCING` -> `SOURCING`, `CANCELLED`
- `SOURCING` -> `SUPPLIER_QUOTES_RECEIVED`

### Roles
- Read access: `SUPER_ADMIN`, `OPERATIONS_ADMIN`, `FINANCE_ADMIN`
- Status updates: `SUPER_ADMIN`, `OPERATIONS_ADMIN`

### Missing Endpoint
- `convert-to-order` is not exposed by the current API contract, so it is represented as a disabled foundation action instead of a live mutation.

## Files Changed
- `src/features/requests/requests.types.ts`
- `src/features/requests/requests.api.ts`
- `src/features/requests/components/RequestActionDialog.tsx`
- `src/features/requests/components/RequestActionsPanel.tsx`
- `src/app/dashboard/requests/[id]/page.tsx`
- `README.md`

## UI Behavior
- The request detail page now renders a live actions panel above the request detail cards.
- Buttons are shown only for status transitions supported by the backend contract.
- Clicking an action opens a confirmation dialog before the PATCH request runs.
- Successful updates refresh the request detail view so the new status is reflected immediately.
- Failures surface as inline alerts in the action panel.
- The `Convert to order` action is shown as a disabled placeholder to preserve the foundation for the later API addition.

## Auth Behavior
- The action call uses the same authenticated admin API client as the rest of the module.
- The request includes the stored bearer token through the existing client interceptor.

## Verification Results
- The admin request detail page wiring was updated to call the live status endpoint.
- The backend contract was checked against the standalone API repository before wiring the actions.
- The phase does not add a new backend endpoint or a new order-conversion flow.

## Current Limitations
- `Convert to order` is still pending API support.
- No render/deployment work was performed in this phase.
- This phase only covers the Requests action foundation, not the full request lifecycle.

## Next Step
Phase 17.5 should continue the Requests workflow only if the backend exposes the next needed mutation.
