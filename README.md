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

This phase provides the initial admin shell, authenticated login flow, dashboard foundation, API client wrapper, and auth guards.

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

## Next Step

Phase 17.2 will wire the first real admin module against authenticated API requests.
