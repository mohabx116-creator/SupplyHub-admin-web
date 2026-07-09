# Admin Requests Module

## Purpose

Wire the first real admin module in `SupplyHub-admin-web` so authenticated admin users can list and inspect procurement requests from the SupplyHub API.

## Backend contract discovered

- List endpoint: `GET /api/admin/requests`
- Detail endpoint: `GET /api/admin/requests/:id`
- Auth header: `Authorization: Bearer <accessToken>`
- Query params: `status`, `companyId`
- Status values:
  - `NEW`
  - `NEEDS_REVIEW`
  - `NEEDS_CLARIFICATION`
  - `READY_FOR_SOURCING`
  - `SOURCING`
  - `SUPPLIER_QUOTES_RECEIVED`
  - `CUSTOMER_QUOTE_SENT`
  - `CUSTOMER_APPROVED`
  - `CUSTOMER_REJECTED`
  - `CANCELLED`
  - `CONVERTED_TO_ORDER`
- Response shape:
  - top-level request record with scalar request fields
  - nested `company`
  - nested `requestedBy`
  - nested `items`
- Item shape:
  - `id`
  - `requestId`
  - `name`
  - `description`
  - `quantity`
  - `unit`
  - `specifications`
  - `preferredBrand`
  - `estimatedBudget`
  - `createdAt`
  - `updatedAt`
- Pagination shape: none exposed in this phase
- Empty response shape: empty array for list, 404 for missing detail
- Error shape: API error envelope handled by the shared frontend API client
- Required role: `SUPER_ADMIN`, `OPERATIONS_ADMIN`, or `FINANCE_ADMIN` for read access

## Frontend routes added

- `/dashboard/requests`
- `/dashboard/requests/[id]`

## Files created

- `src/app/dashboard/requests/page.tsx`
- `src/app/dashboard/requests/[id]/page.tsx`
- `src/features/requests/requests.types.ts`
- `src/features/requests/requests.api.ts`
- `src/features/requests/components/RequestStatusChip.tsx`
- `src/features/requests/components/RequestsTable.tsx`
- `src/features/requests/components/RequestsLoadingState.tsx`
- `src/features/requests/components/RequestsEmptyState.tsx`
- `src/features/requests/components/RequestsErrorState.tsx`
- `docs/03-admin-requests-module.md`

## Files modified

- `src/lib/routes/routes.ts`
- `src/components/layout/AppSidebar.tsx`
- `README.md`

## UI behavior

- `/dashboard/requests` loads the real authenticated admin request list
- a status filter refetches the list with the real API query param
- the refresh button reloads the current view
- clicking a table row opens the request detail page
- detail view shows the nested company, requester, item, and internal note data returned by the API

## Loading, error, and empty states

- Loading uses skeleton-based placeholders
- API failures show a retryable error alert
- empty result sets show a dedicated empty state with refresh

## Auth behavior

- the existing auth provider and bearer-token interceptor are reused
- no duplicate token handling was added
- unauthenticated users are still protected by the dashboard guard

## Env requirements

- `NEXT_PUBLIC_API_BASE_URL`

## Verification results

- `pnpm install --frozen-lockfile` passed
- `pnpm build` passed
- `pnpm lint` passed
- `pnpm type-check` passed

## Runtime smoke

- No authenticated runtime smoke was performed in this turn
- The Requests module is compiler-verified, but live API smoke still depends on an available session and a running backend

## Limitations

- No pagination yet
- No request create/edit/status actions in the frontend yet
- No dedicated pagination or server-side search controls yet

## Recommended next phase

- Phase 17.3: add the next admin workflow module on top of the authenticated Requests foundation
