# Admin Purchase Orders Module

## Purpose

Phase 17.9 adds a read-only Purchase Orders experience to the admin dashboard. The UI is built on top of the live backend `orders` contract and does not include any create, update, cancel, approve, or status mutation actions.

## Backend Contract

The admin frontend uses the existing order endpoints exposed by the backend:

- `GET /admin/orders`
- `GET /admin/orders/:id`

Supported list filters used by the UI:

- `status`
- `requestId`
- `search`

The frontend preserves backend route paths, enum values, and payload values. Only display labels are localized.

## Frontend Surfaces

Implemented in `SupplyHub-admin-web`:

- `/dashboard/orders`
- `/dashboard/orders/[id]`

Files added for the module:

- `src/app/dashboard/orders/page.tsx`
- `src/app/dashboard/orders/[id]/page.tsx`
- `src/features/orders/*`
- `src/lib/routes/routes.ts`
- `src/lib/i18n/messages.ts`
- `src/lib/i18n/ar.ts`

## Localization

Purchase Orders copy was added to the bilingual localization system in both English and Arabic.

The module uses localized labels for:

- page titles
- helper copy
- table headers
- status labels
- empty and error states
- request and quotation summary labels
- detail page field labels

Backend enum values remain internal. The UI maps those enum values to localized display labels only.

## Notes

- The admin sidebar now shows `Purchase Orders` in English and `أوامر الشراء` in Arabic.
- The module route stays `/dashboard/orders` to match the backend `orders` resource.
- This phase intentionally avoids mutations and only exposes read/list and detail access.

