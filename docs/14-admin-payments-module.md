# Admin Payments Module

## Purpose

Phase 17.10 adds a read-only Payments experience to the admin dashboard. The UI is built directly on the live backend payments contract and does not include create, update, mark-paid, refund, or other mutation actions.

## Backend Contract Discovered

The admin frontend uses the following backend endpoints:

- `GET /admin/payments`
- `GET /admin/payments/:id`

Related read-only endpoint exposed by the backend, but not required for this phase:

- `GET /admin/orders/:orderId/payments`

Supported list filters:

- `status`
- `method`
- `companyId`
- `orderId`
- `reference`

Authentication and access control:

- JWT bearer auth is required.
- `SUPER_ADMIN`, `FINANCE_ADMIN`, and `OPERATIONS_ADMIN` can read the admin payments endpoints.
- `CUSTOMER` is blocked from admin payments endpoints.

## Backend Contract Audit

List endpoint:

- `GET /admin/payments`
- Returns a plain JSON array of payment records.
- The current backend slice does not add pagination metadata, cursors, or totals.

Detail endpoint:

- `GET /admin/payments/:id`
- Returns a single payment record with the same response shape as the list items.

Auth header:

- `Authorization: Bearer <JWT>`

Query params:

- `status` - backend `PaymentStatus` enum value
- `method` - backend `PaymentMethod` enum value
- `companyId` - UUID
- `orderId` - UUID
- `reference` - free-text reference search

Response shape:

- The admin response is not wrapped in a pagination envelope for this phase.
- The list and detail responses both expose the payment record directly.

Payment item shape:

- Top-level payment fields:
  - `id`
  - `orderId`
  - `companyId`
  - `status`
  - `method`
  - `currency`
  - `amount`
  - `paidAmount`
  - `outstandingAmount`
  - `reference`
  - `paidAt`
  - `failedAt`
  - `cancelledAt`
  - `refundedAt`
  - `customerNotes`
  - `internalNotes`
  - `createdAt`
  - `updatedAt`
- Nested `order` fields:
  - `id`
  - `orderNumber`
  - `requestId`
  - `customerQuotationId`
  - `status`
  - `currency`
  - `grandTotal`
  - `confirmedAt`
  - `cancelledAt`
  - `deliveredAt`
  - `createdAt`
  - `updatedAt`
- Nested `company` fields:
  - `id`
  - `name`
  - `status`

Status values:

- `PENDING`
- `PARTIALLY_PAID`
- `PAID`
- `FAILED`
- `CANCELLED`
- `REFUNDED`

Payment method values:

- `CASH`
- `BANK_TRANSFER`
- `CARD`
- `WALLET`
- `OTHER`

Amount, currency, and due-date fields:

- Amount fields are returned as decimal strings.
- Currency is returned as the backend order/payment currency code.
- The current admin payment contract does not expose a due date field.

Error shape:

- Validation and business-rule errors use the backend API error envelope:
  - `statusCode`
  - `code`
  - `message`
  - `details` when available
  - `path`
  - `timestamp`
- Validation failures include field-level `details` entries.
- Not found, unauthorized, forbidden, conflict, rate limit, and internal error responses all use the same envelope.

Required roles:

- `SUPER_ADMIN`
- `FINANCE_ADMIN`
- `OPERATIONS_ADMIN` for read access

Mutation/action endpoints found but not implemented in this phase:

- `POST /admin/orders/:orderId/payments`
- `PATCH /admin/payments/:id`
- `PATCH /admin/payments/:id/status`
- `GET /admin/orders/:orderId/payments` is available as a related read-only route but is not required by the current admin UI slice.

## Frontend Routes Added

- `/dashboard/payments`
- `/dashboard/payments/[id]`

## Files Added or Modified

- `src/app/dashboard/payments/page.tsx`
- `src/app/dashboard/payments/[id]/page.tsx`
- `src/features/payments/payments.api.ts`
- `src/features/payments/payments.types.ts`
- `src/features/payments/components/*`
- `src/features/payments/index.ts`
- `src/lib/routes/routes.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/ar.ts`

## UI Behavior

- The payments list loads live backend payment records.
- The list is clickable and opens the payment detail page.
- Filtering is available for backend-supported query parameters only.
- The detail page shows the payment summary, linked order, linked company, notes, and timeline fields from the backend response.
- The implementation uses the shared authenticated API client and does not duplicate token handling.
- The UI never sends translated labels to the backend; only backend enum values and IDs are transmitted.
- No fake payment records are used anywhere in the module.

## Loading, Error, and Empty States

- Loading states are shown while list/detail data is being fetched.
- Error states show the backend or transport error message.
- Empty states explain that no payments are available for the selected filters.

## Localization

All visible Payments copy was added to the bilingual localization system in English and Arabic.

Localized areas include:

- page titles and descriptions
- filter labels and placeholders
- table headers
- status labels
- payment method labels
- empty state copy
- error copy
- detail labels
- timeline labels

Backend enum values remain internal. The UI maps payment and order status values to localized labels only.

Audit result:

- No new hardcoded user-facing Payments strings remain in the Payments module files.
- English and Arabic dictionaries expose the same Payments keys.
- Backend enum values, IDs, and query values remain untouched.
- The module keeps display labels local to the UI layer only.

## Environment Notes

- The frontend uses `NEXT_PUBLIC_API_BASE_URL` through the existing authenticated API client.
- No new secrets or private environment variables were added.

## Validation

- `pnpm install --frozen-lockfile` completed successfully.
- `pnpm lint` completed successfully.
- `pnpm type-check` completed successfully.
- `pnpm build` completed successfully.
- Next.js produced the expected `/dashboard/payments` and `/dashboard/payments/[id]` routes in the build output.

## Limitations

- No create, update, status-change, or refund UI was implemented in this phase.
- No browser QA was performed in this turn.
- No live authenticated runtime smoke was performed in this turn.

## Recommended Next Phase

Proceed with the next admin module or any requested Payments mutation phase after backend approval.
