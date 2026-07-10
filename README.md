# SupplyHub Admin Web

Standalone Next.js admin dashboard foundation for SupplyHub.

## Stack

- Next.js App Router
- TypeScript
- Material UI
- Axios
- Zustand

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm type-check`

## Setup

1. Copy `.env.example` to `.env.local` if needed.
2. Set `NEXT_PUBLIC_API_BASE_URL` for local development.
3. Run `pnpm install`.

## Scope

This phase provides the initial admin shell, authenticated login flow, dashboard foundation, API client wrapper, auth guards, the first Requests module, and the Suppliers list/detail foundation.
The Requests detail page now also supports real status transitions that are already exposed by the backend, while convert-to-order remains a disabled placeholder until the API adds that endpoint.
The Suppliers module now reads from the live admin supplier API and exposes list and detail views without any fake backend data.

It does not yet implement:

- backend mutations
- deployment

## Auth

- `NEXT_PUBLIC_API_BASE_URL` points the frontend at the API base URL
- Login is wired to `POST /api/auth/login`
- The current user bootstrap uses `GET /api/auth/me`
- Access tokens are stored in `localStorage` for this phase only
- Protected dashboard routes redirect unauthenticated users to `/login`
- Logged-in users are redirected away from `/login` to `/dashboard`

## Current Limitations

- No refresh-token flow yet
- No logout endpoint is used because the API does not expose one
- RBAC UI is not implemented beyond the backend role field display
- Convert-to-order is not yet exposed by the backend admin requests API
- Supplier mutations are not implemented yet

## Next Step

Phase 17.3 will extend the authenticated admin area with the next workflow module.
