# Admin Suppliers Mutations Foundation

## Purpose
This document records the first live mutation layer for the SupplyHub admin Suppliers module. The phase wires create, edit, and status actions to the real backend contract while keeping the UI backend-driven.

## Backend Mutation Contract Discovered

### Endpoints
- `POST /api/admin/suppliers`
- `PATCH /api/admin/suppliers/:id`
- `PATCH /api/admin/suppliers/:id/status`

### Auth
- JWT bearer token required on every supplier mutation request.
- Roles allowed to mutate suppliers: `SUPER_ADMIN`, `OPERATIONS_ADMIN`.

### Create Payload
- `name` required
- `legalName?`
- `email?`
- `phone?`
- `whatsapp?`
- `city?`
- `address?`
- `taxNumber?`
- `status?`
- `category?`
- `notes?`
- `contacts?[]`

### Update Payload
- Same supported fields as create, except status is not part of the general update payload
- `contacts?[]` can be replaced in the same request

### Status Payload
- `status` only

### Response Shape
- All mutation endpoints return the full supplier record
- Response includes nested `contacts`
- The frontend refreshes from the backend result rather than faking local success

### Validation Rules
- Supplier name is required on create
- Email is validated when provided
- Contact names are required when contacts are submitted
- Status is enum-based
- Unknown supplier IDs return `404`
- Invalid payloads return `400`

### Status Values
- `ACTIVE`
- `INACTIVE`
- `BLACKLISTED`

### Contact Handling Support
- Contacts are supported inline in the create and update payloads
- Contact editing is implemented in the supplier form foundation using the backend-supported contact shape

## Implemented Actions
- Create supplier
- Edit supplier basic details
- Update supplier contacts inline
- Change supplier status with confirmation

## Disabled or Deferred Actions
- No pagination changes were added
- No bulk supplier mutation actions were added
- No supplier deletion action was added

## Files Changed
- `src/features/suppliers/suppliers.api.ts`
- `src/features/suppliers/suppliers.types.ts`
- `src/features/suppliers/components/SupplierFormDialog.tsx`
- `src/features/suppliers/components/SupplierStatusDialog.tsx`
- `src/features/suppliers/components/SupplierActionsPanel.tsx`
- `src/app/dashboard/suppliers/page.tsx`
- `src/app/dashboard/suppliers/[id]/page.tsx`
- `README.md`

## UI Behavior
- The list page includes an `Add Supplier` action.
- The detail page includes `Edit Supplier` and `Change Status` actions.
- Status changes require confirmation.
- Blacklisted status uses stronger warning copy.
- After successful mutations the list or detail page refreshes from the API.

## Error, Loading, and Success Behavior
- Mutation buttons disable while requests are in flight.
- API errors are shown inline in the action panel.
- Success messages are shown after backend success.
- Dialogs close only after successful backend response.

## Runtime Smoke Limitations
- No live create/update/status mutation smoke was executed in this turn.
- Non-destructive dialog opening and form rendering should be verified manually before any real mutation is attempted.

## Verification Results
- The backend suppliers mutation contract was confirmed directly from the API repository.
- The frontend mutation helpers and dialogs were added to match that contract.
- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm type-check`, and `pnpm build` all pass after the update.

## Known Limitations
- Supplier deletion is not implemented.
- Pagination is still not implemented.
- No deployment was performed.

## Recommended Next Step
- Add supplier deletion or list pagination only if the backend contract is extended for those workflows.
