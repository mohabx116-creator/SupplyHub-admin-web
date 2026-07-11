# Admin Deliveries Module

## Purpose

Phase 17.11 adds a real Deliveries read/list experience to the admin dashboard. The admin UI is wired to the live backend deliveries contract and remains read-only in this phase.

## Backend Contract Discovered

The admin frontend uses the following backend endpoints:

- `GET /admin/deliveries`
- `GET /admin/deliveries/:id`

Related read-only endpoint exposed by the backend, but not required for this phase:

- `GET /admin/orders/:orderId/deliveries`

Mutation endpoints found in the backend but not implemented in this phase:

- `POST /admin/orders/:orderId/deliveries`
- `PATCH /admin/deliveries/:id`
- `PATCH /admin/deliveries/:id/status`

Supported list filters:

- `status`
- `method`
- `companyId`
- `orderId`
- `trackingReference`

Authentication and access control:

- JWT bearer auth is required.
- `SUPER_ADMIN`, `OPERATIONS_ADMIN`, and `FINANCE_ADMIN` can read admin deliveries endpoints.
- `SUPER_ADMIN` and `OPERATIONS_ADMIN` can create or mutate deliveries.
- `CUSTOMER` is blocked from admin deliveries endpoints.

## Delivery Contract Audit

List endpoint:

- `GET /admin/deliveries`
- Returns a plain JSON array of delivery records.
- The current backend slice does not add pagination metadata, cursors, or totals.

Detail endpoint:

- `GET /admin/deliveries/:id`
- Returns a single delivery record with the same response shape as the list items.

Auth header:

- `Authorization: Bearer <JWT>`

Query params:

- `status` - backend `DeliveryStatus` enum value
- `method` - backend `DeliveryMethod` enum value
- `companyId` - UUID
- `orderId` - UUID
- `trackingReference` - free-text tracking search

Response shape:

- The admin response is not wrapped in a pagination envelope for this phase.
- The list and detail responses both expose the delivery record directly.

Delivery item shape:

- Top-level delivery fields:
  - `id`
  - `orderId`
  - `companyId`
  - `status`
  - `method`
  - `deliveryAddress`
  - `deliveryContactName`
  - `deliveryContactPhone`
  - `trackingReference`
  - `scheduledAt`
  - `dispatchedAt`
  - `deliveredAt`
  - `failedAt`
  - `cancelledAt`
  - `returnedAt`
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

Delivery line items shape:

- No delivery line items are exposed by the current backend deliveries contract.

Status values:

- `PENDING`
- `SCHEDULED`
- `IN_TRANSIT`
- `DELIVERED`
- `FAILED`
- `CANCELLED`
- `RETURNED`

Carrier/tracking fields:

- The backend exposes `trackingReference`.
- No separate carrier field is exposed in the current contract.
- The frontend uses the delivery method as the operational method label.

Expected and actual delivery date fields:

- `scheduledAt`
- `dispatchedAt`
- `deliveredAt`
- `failedAt`
- `cancelledAt`
- `returnedAt`

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
- `OPERATIONS_ADMIN`
- `FINANCE_ADMIN` for read access

## Frontend Routes Added

- `/dashboard/deliveries`
- `/dashboard/deliveries/[id]`

## Files Added or Modified

- `src/app/dashboard/deliveries/page.tsx`
- `src/app/dashboard/deliveries/[id]/page.tsx`
- `src/features/deliveries/deliveries.api.ts`
- `src/features/deliveries/deliveries.types.ts`
- `src/features/deliveries/components/*`
- `src/features/deliveries/index.ts`
- `src/lib/routes/routes.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/ar.ts`

## UI Behavior

- The deliveries list loads live backend delivery records.
- The list is clickable and opens the delivery detail page.
- Filtering is available for backend-supported query parameters only.
- The detail page shows the delivery summary, linked order, linked company, notes, and logistics timeline fields from the backend response.
- The implementation uses the shared authenticated API client and does not duplicate token handling.
- The UI never sends translated labels to the backend; only backend enum values and IDs are transmitted.
- No fake delivery records are used anywhere in the module.

## Loading, Error, and Empty States

- Loading states are shown while list/detail data is being fetched.
- Error states show the backend or transport error message.
- Empty states explain that no deliveries are available for the selected filters.

## Localization

All visible Deliveries copy was added to the bilingual localization system in English and Arabic.

Localized areas include:

- page titles and descriptions
- filter labels and placeholders
- table headers
- status labels
- delivery method labels
- empty state copy
- error copy
- detail labels
- timeline labels

Backend enum values remain internal. The UI maps delivery status and delivery method values to localized labels only.

Audit result:

- No new hardcoded user-facing Deliveries strings remain in the Deliveries module files.
- English and Arabic dictionaries expose the same Deliveries keys.
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
- Next.js produced the expected `/dashboard/deliveries` and `/dashboard/deliveries/[id]` routes in the build output.

## Limitations

- No create, update, or status-change UI was implemented in this phase.
- No browser QA was performed in this turn.
- No live authenticated runtime smoke was performed in this turn.

## Recommended Next Phase

Proceed with the next admin module or any requested Deliveries mutation phase after backend approval.
