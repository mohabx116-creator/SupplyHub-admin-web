# Admin Invoices Module

## Purpose

Phase 17.12 adds a read-only Invoices experience to the admin dashboard. The UI is wired to the live backend invoice contract and is limited to list and detail reading in this phase.

## Backend Contract Discovered

The admin frontend uses the following backend endpoints:

- `GET /admin/invoices`
- `GET /admin/invoices/:id`

Related read-only endpoint exposed by the backend, but not required for this phase:

- `GET /admin/orders/:orderId/invoices`

Mutation endpoints found in the backend but not implemented in this phase:

- `POST /admin/orders/:orderId/invoices`
- `PATCH /admin/invoices/:id`
- `PATCH /admin/invoices/:id/status`

Supported list filters:

- `status`
- `type`
- `companyId`
- `orderId`
- `invoiceNumber`

Authentication and access control:

- JWT bearer auth is required.
- `SUPER_ADMIN`, `FINANCE_ADMIN`, and `OPERATIONS_ADMIN` can read admin invoices endpoints.
- `CUSTOMER` is blocked from admin invoices endpoints.

## Invoice Contract Audit

List endpoint:

- `GET /admin/invoices`
- Returns a plain JSON array of invoice records.
- The current backend slice does not add pagination metadata, cursors, or totals.

Detail endpoint:

- `GET /admin/invoices/:id`
- Returns a single invoice record with the same response shape as the list items.

Auth header:

- `Authorization: Bearer <JWT>`

Query params:

- `status` - backend `InvoiceStatus` enum value
- `type` - backend `InvoiceType` enum value
- `companyId` - UUID
- `orderId` - UUID
- `invoiceNumber` - exact invoice-number search

Response shape:

- The admin response is not wrapped in a pagination envelope for this phase.
- The list and detail responses both expose the invoice record directly.

Invoice item shape:

- Top-level invoice fields:
  - `id`
  - `invoiceNumber`
  - `orderId`
  - `companyId`
  - `status`
  - `type`
  - `currency`
  - `itemsSubtotal`
  - `discountTotal`
  - `taxTotal`
  - `grandTotal`
  - `paidAmount`
  - `outstandingAmount`
  - `issuedAt`
  - `dueAt`
  - `paidAt`
  - `cancelledAt`
  - `voidedAt`
  - `refundedAt`
  - `customerNotes`
  - `internalNotes`
  - `createdAt`
  - `updatedAt`
- Nested `order` fields:
  - `id`
  - `orderNumber`
  - `status`
  - `currency`
  - `grandTotal`
  - `createdAt`
  - `updatedAt`
- Nested `company` fields:
  - `id`
  - `name`
  - `status`
- Nested `items` fields:
  - `id`
  - `invoiceId`
  - `orderItemId`
  - `description`
  - `quantity`
  - `unitPrice`
  - `lineSubtotal`
  - `taxAmount`
  - `lineTotal`
  - `createdAt`
  - `updatedAt`

Status values:

- `DRAFT`
- `ISSUED`
- `PARTIALLY_PAID`
- `PAID`
- `OVERDUE`
- `CANCELLED`
- `VOID`
- `REFUNDED`

Type values:

- `STANDARD`
- `PROFORMA`
- `CREDIT_NOTE`
- `DEBIT_NOTE`

Amount and billing fields:

- Amount fields are returned as decimal strings.
- Currency is returned as the backend order/payment currency code.
- The admin invoice contract does not expose a separate payment gateway or PDF document field.

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

## Frontend Routes Added

- `/dashboard/invoices`
- `/dashboard/invoices/[id]`

## Files Added or Modified

- `src/app/dashboard/invoices/page.tsx`
- `src/app/dashboard/invoices/[id]/page.tsx`
- `src/features/invoices/invoices.api.ts`
- `src/features/invoices/invoices.types.ts`
- `src/features/invoices/components/*`
- `src/features/invoices/index.ts`
- `src/lib/routes/routes.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/ar.ts`
- `src/components/layout/AppHeader.tsx`

## UI Behavior

- The invoices list loads live backend invoice records.
- The list is clickable and opens the invoice detail page.
- Filtering is available for backend-supported query parameters only.
- The detail page shows the invoice summary, linked order, linked company, notes, invoice line items, and timeline fields from the backend response.
- The implementation uses the shared authenticated API client and does not duplicate token handling.
- The UI never sends translated labels to the backend; only backend enum values and IDs are transmitted.
- No fake invoice records are used anywhere in the module.

## Loading, Error, and Empty States

- Loading states are shown while list/detail data is being fetched.
- Error states show the backend or transport error message.
- Empty states explain that no invoices are available for the selected filters.

## Localization

All visible Invoices copy was added to the bilingual localization system in English and Arabic.

Localized areas include:

- page titles and descriptions
- filter labels and placeholders
- table headers
- status labels
- type labels
- empty state copy
- error copy
- detail labels
- timeline labels

Backend enum values remain internal. The UI maps invoice status and invoice type values to localized labels only.

Audit result:

- No new hardcoded user-facing Invoices strings remain in the Invoices module files.
- English and Arabic dictionaries expose the same Invoices keys.
- Backend enum values, IDs, and query values remain untouched.
- The module keeps display labels local to the UI layer only.

## Environment Notes

- The frontend uses `NEXT_PUBLIC_API_BASE_URL` through the existing authenticated API client.
- No new secrets or private environment variables were added.

## Limitations

- No create, update, or status-change UI was implemented in this phase.
- No browser QA was performed in this turn.
- No live authenticated runtime smoke was performed in this turn.

## Recommended Next Phase

Proceed with the next admin module or any requested Invoices mutation phase after backend approval.
