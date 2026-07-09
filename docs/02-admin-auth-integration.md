# Admin Auth Integration

## Purpose

Connect the standalone admin frontend to the real SupplyHub API authentication contract and add guarded navigation for dashboard routes.

## Backend Auth Contract Discovered

- Login endpoint: `POST /api/auth/login`
- Login request body: `{ email, password }`
- Login response shape: `{ accessToken, user }`
- Current user endpoint: `GET /api/auth/me`
- Refresh endpoint: not available in the API contract inspected for this phase
- Logout endpoint: not available in the API contract inspected for this phase
- Auth header format: `Authorization: Bearer <accessToken>`

## Frontend Files Changed

- `src/features/auth/auth.types.ts`
- `src/features/auth/auth.api.ts`
- `src/features/auth/auth.store.ts`
- `src/features/auth/auth.storage.ts`
- `src/components/auth/AuthProvider.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequirePublic.tsx`
- `src/lib/api/api-client.ts`
- `src/lib/config/env.ts`
- `src/app/login/page.tsx`
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/[module]/page.tsx`
- `src/components/layout/AppHeader.tsx`
- `src/app/layout.tsx`

## Auth Storage Strategy

- The access token is stored in `localStorage` for this phase only
- The auth provider bootstraps the session by reading the stored token and calling `GET /api/auth/me`
- Logout clears both local state and the stored token

## Route Guard Behavior

- Unauthenticated users visiting dashboard routes are redirected to `/login`
- Authenticated users visiting `/login` are redirected to `/dashboard`
- The dashboard header shows the signed-in user and provides logout

## Env Keys

- `NEXT_PUBLIC_API_BASE_URL`

## Verification Results

- `pnpm install`
- `pnpm build`
- `pnpm lint`
- `pnpm type-check`

## Limitations

- No refresh-token flow yet
- No backend logout endpoint is used
- RBAC enforcement remains backend-driven and not yet surfaced as a dedicated UI layer

## Next Phase Recommendation

- Phase 17.2: wire the first real admin module against authenticated API requests
