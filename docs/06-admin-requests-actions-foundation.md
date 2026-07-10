# Admin Requests Actions Foundation

## Purpose
This document records the first action layer for the SupplyHub admin Requests module. The goal of this phase was to expose the real backend status transition contract in the admin UI without inventing unsupported mutations.

## Backend Contract Confirmed
- `GET /api/admin/requests`
- `GET /api/admin/requests/:id`
- `PATCH /api/admin/requests/:id/status`
- `PATCH /api/admin/requests/:id/internal-notes`

### Response Shape
- List and detail endpoints return the full admin request record with nested `company`, `requestedBy`, and `items`.
- Status update and internal-notes update return the updated admin request record using the same shape.
- The frontend refreshes from the returned request ID state, rather than faking a local status-only mutation.

### Status Update Payload
- Request body: `{ status }`

### Internal Notes Payload
- Request body: `{ internalNotes? }`

### Allowed Status Transitions
- `NEW` -> `NEEDS_REVIEW`, `NEEDS_CLARIFICATION`, `READY_FOR_SOURCING`, `CANCELLED`
- `NEEDS_REVIEW` -> `NEEDS_CLARIFICATION`, `READY_FOR_SOURCING`, `CANCELLED`
- `NEEDS_CLARIFICATION` -> `NEEDS_REVIEW`, `READY_FOR_SOURCING`, `CANCELLED`
- `READY_FOR_SOURCING` -> `SOURCING`, `CANCELLED`
- `SOURCING` -> `SUPPLIER_QUOTES_RECEIVED`

### Roles
- Read access: `SUPER_ADMIN`, `OPERATIONS_ADMIN`, `FINANCE_ADMIN`
- Status updates: `SUPER_ADMIN`, `OPERATIONS_ADMIN`
- Internal notes updates: `SUPER_ADMIN`, `OPERATIONS_ADMIN`

### Validation and Errors
- `id` is validated as a UUID by the API route pipe.
- `status` is validated by the DTO enum guard before the service transition check.
- Invalid or unsupported transitions return a `BadRequestException` with `Status transition is not allowed`.
- Missing or invalid tokens return `401`.
- Non-admin access returns `403`.
- Unknown request IDs return `404`.

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
- The action request uses the shared authenticated API client and reuses the stored bearer token interceptor.
- Successful updates refresh the request detail view so the returned server state is reloaded immediately.
- Failures surface as inline alerts in the action panel.
- The `Convert to order` action is shown as a disabled placeholder to preserve the foundation for the later API addition.

## Auth Behavior
- The action call uses the same authenticated admin API client as the rest of the module.
- The request includes the stored bearer token through the existing client interceptor.
- No local-only status mutation is used; the response from the API is what drives the refresh flow.

## Verification Results
- The admin request detail page wiring was updated to call the live status endpoint.
- The backend contract was checked against the standalone API repository before wiring the actions.
- The phase does not add a new backend endpoint or a new order-conversion flow.

## Runtime Smoke Limitations
- No destructive runtime mutation smoke was performed in this review.
- Safe browser verification would require a ready local API session and explicit approval before exercising live state-changing actions.

## Current Limitations
- `Convert to order` is still pending API support.
- No render/deployment work was performed in this phase.
- This phase only covers the Requests action foundation, not the full request lifecycle.

## Safety Notes
- No backend/API files were modified.
- No Prisma schema or migration changes were made.
- No secrets, `.env` values, DB URLs, or tokens were printed or committed.
- The unrelated list/detail Requests flows remain intact.

## Next Step
Phase 17.5 should continue the Requests workflow only if the backend exposes the next needed mutation.
