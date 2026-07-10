# Admin Suppliers Module

## Purpose
This document records the first live admin Suppliers module for the SupplyHub dashboard. The phase wires the authenticated frontend to the real backend suppliers contract without inventing data or unsupported endpoints.

## Backend Suppliers Contract Discovered

### Endpoints
- `GET /api/admin/suppliers`
- `GET /api/admin/suppliers/:id`

### Auth
- JWT bearer token required on every supplier admin request.
- Roles allowed to read suppliers: `SUPER_ADMIN`, `OPERATIONS_ADMIN`, `FINANCE_ADMIN`.

### Query Params
- `status`
- `city`
- `category`
- `search`

### Response Shape
- The list endpoint returns an array of supplier records, not a paginated envelope.
- The detail endpoint returns one supplier record.
- Each supplier record includes nested `contacts`.

### Supplier Item Shape
- `id`
- `name`
- `legalName`
- `email`
- `phone`
- `whatsapp`
- `city`
- `address`
- `taxNumber`
- `status`
- `category`
- `notes`
- `createdAt`
- `updatedAt`
- `contacts[]`

### Contact Item Shape
- `id`
- `supplierId`
- `name`
- `role`
- `email`
- `phone`
- `whatsapp`
- `isPrimary`
- `createdAt`
- `updatedAt`

### Status Values
- `ACTIVE`
- `INACTIVE`
- `BLACKLISTED`

### Error Shape
- Validation and auth failures are returned by the shared API error envelope.
- Invalid UUIDs on the detail route are rejected by the route pipe.
- Missing tokens return `401`.
- Forbidden roles return `403`.
- Unknown supplier IDs return `404`.

## Frontend Routes Added
- `/dashboard/suppliers`
- `/dashboard/suppliers/[id]`

## Files Created
- `src/app/dashboard/suppliers/page.tsx`
- `src/app/dashboard/suppliers/[id]/page.tsx`
- `src/features/suppliers/suppliers.types.ts`
- `src/features/suppliers/suppliers.api.ts`
- `src/features/suppliers/components/SupplierStatusChip.tsx`
- `src/features/suppliers/components/SuppliersEmptyState.tsx`
- `src/features/suppliers/components/SuppliersErrorState.tsx`
- `src/features/suppliers/components/SuppliersLoadingState.tsx`
- `src/features/suppliers/components/SuppliersTable.tsx`

## Files Modified
- `src/lib/routes/routes.ts`
- `src/components/layout/AppSidebar.tsx`
- `src/app/dashboard/page.tsx`
- `src/features/suppliers/index.ts`
- `README.md`

## UI Behavior
- `/dashboard/suppliers` shows a live suppliers table with row navigation to detail view.
- The page supports filters for status, city, category, and free-text search because the backend supports those query params.
- The detail page shows supplier metadata and nested contact records.
- No fake success states are used.

## Loading, Error, and Empty Behavior
- List and detail pages show loading skeletons while requests are in flight.
- Errors surface as inline retryable alerts.
- Empty list results show a dedicated empty state with refresh support.

## Auth Behavior
- The existing authenticated API client is reused.
- Bearer token handling remains centralized in the shared request interceptor.
- No manual token attachment logic was added to the suppliers feature.

## Environment Requirements
- `NEXT_PUBLIC_API_BASE_URL` must point to the SupplyHub API.
- No additional secrets or private env keys are required for this module.

## Verification Results
- The backend suppliers contract was confirmed directly from the API repo.
- The frontend routes, types, and API client were added to match the live contract.
- Runtime smoke was not completed because no safe authenticated browser session was available in this turn.

## Limitations
- There is no pagination yet because the backend currently returns a plain array.
- Supplier mutations are not implemented in this phase.
- No deployment was performed.

## Recommended Next Phase
- Add supplier mutations only if the backend contract expands to support them.
