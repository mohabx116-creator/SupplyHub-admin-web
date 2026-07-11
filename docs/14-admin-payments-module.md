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
