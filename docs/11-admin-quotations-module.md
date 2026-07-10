# Admin Quotations Module

## Purpose
Provide a read/list foundation for the authenticated admin quotations area in `SupplyHub-admin-web`, using the real request-scoped supplier quotations API contract from `SupplyHub-api`.

## Backend Contract Discovered

The admin quotations flow is backed by the supplier quotations endpoints exposed under the authenticated admin API.

### List endpoint
- `GET /api/admin/requests/:requestId/supplier-quotations`

### Detail endpoint
- `GET /api/admin/supplier-quotations/:id`

### Auth header
- Bearer JWT required through the shared authenticated API client.

### Query params
- `status` - backend `SupplierQuotationStatus` enum value
- `supplierId` - supplier UUID

### Response shape
- `id`
- `requestId`
- `supplierId`
- `status`
- `currency`
- `subtotal`
- `shippingCost`
- `taxAmount`
- `discountAmount`
- `grandTotal`
- `validUntil`
- `leadTimeDays`
- `notes`
- `createdAt`
- `updatedAt`
- `supplier`
- `request`
- `items`

### Item shape
- `id`
- `supplierQuotationId`
- `requestItemId`
- `name`
- `description`
- `quantity`
- `unit`
- `unitPrice`
- `lineTotal`
- `notes`
- `createdAt`
- `updatedAt`

### Status values
- `DRAFT`
- `RECEIVED`
- `SELECTED`
- `REJECTED`
- `EXPIRED`
- `CANCELLED`

### Required roles
- `SUPER_ADMIN`
- `OPERATIONS_ADMIN`
- `FINANCE_ADMIN` for read access

### Mutation/action endpoints found but not implemented
- `POST /api/admin/requests/:requestId/supplier-quotations`
- `PATCH /api/admin/supplier-quotations/:id`
- `PATCH /api/admin/supplier-quotations/:id/status`

Those mutation routes exist in the backend, but this phase intentionally implements read/list foundation only.

## Frontend Routes Added
- `/dashboard/quotations`
- `/dashboard/quotations/[id]`

## Files Created
- `src/app/dashboard/quotations/page.tsx`
- `src/app/dashboard/quotations/[id]/page.tsx`
- `src/features/quotations/quotations.types.ts`
- `src/features/quotations/quotations.api.ts`
- `src/features/quotations/index.ts`
- `src/features/quotations/components/QuotationStatusChip.tsx`
- `src/features/quotations/components/QuotationsTable.tsx`
- `src/features/quotations/components/QuotationsLoadingState.tsx`
- `src/features/quotations/components/QuotationsErrorState.tsx`
- `src/features/quotations/components/QuotationsEmptyState.tsx`

## Files Modified
- `src/lib/routes/routes.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/ar.ts`

## i18n Keys Added
- Quotations list, filters, empty, error, and detail copy
- Quotations status labels
- Quotations table headers
- Linked request and supplier summary labels
- Line item labels

## UI Behavior
- The quotations page is request-scoped.
- The page first loads procurement requests and requires one to be selected.
- The quotations table then loads supplier quotations for that request.
- Status and supplier ID filters are applied through the backend query contract.
- Clicking a quotation row opens its detail page.
- The detail page shows quotation metadata, linked request data, supplier profile data, and line items.

## Loading / Error / Empty Behavior
- Loading states are shown while requests or quotations are being fetched.
- Error states use the shared admin alert pattern and can be retried.
- Empty states differentiate between:
  - no procurement requests available
  - no quotations for the selected request

## Auth Behavior
- The existing authenticated API client attaches the Bearer token centrally.
- No duplicate token logic was added.

## Environment Requirements
- No new environment variables were added.
- The module uses the existing admin API base configuration.

## Verification Result
- `pnpm install --frozen-lockfile` completed successfully.
- `pnpm lint` completed successfully.
- `pnpm type-check` completed successfully.
- `pnpm build` completed successfully.
- A local dev server smoke check returned `200 OK` for `/dashboard/quotations` on `http://127.0.0.1:3000` with no cookies supplied.
- A full authenticated redirect-vs-login browser check was not completed in this turn.

## Limitations
- The backend contract is request-scoped, so there is no global quotations list endpoint.
- This phase does not implement quotation mutations.
- Detail data is only as rich as the backend response contract.

## Recommended Next Phase
- Continue with the next admin module phase after quotations read/list is verified.
